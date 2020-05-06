/**
 * flowground :- mVISE iPaaS / enforce-universal-connector
 * Copyright © 2020, mVISE AG
 * contact: info@mvise.de
 *
 * All files of this connector are licensed under the Apache 2.0 License. For details
 * see the file LICENSE on the top-level directory.
 */

'use strict';

const { messages, } = require('elasticio-node');
const { TimeBox, } = require('./../services/time-box');
const { requestLogic, } = require('./../services/request-invoices');

//  ---------------------------------------------------------------------------

async function logData(from, cfgIn, msgIn, msgOut, storeIn, storeOut) {

    this.logger.info('---from: %s', from);
    this.logger.info('---msgIn: %j', msgIn);
    this.logger.info('---msgOut: %j', msgOut);
    this.logger.info('---cfgIn: %j', cfgIn);
    this.logger.info('---storeIn: %j', storeIn);
    this.logger.info('---storeOut: %j', storeOut);
}

//  ---------------------------------------------------------------------------
//  handling for - immediate status after start and before parameter setting
//  should never be called

async function flow0(msg={}, cfg={}, store={}, tb=new TimeBox(), ) {

    try {
        const verbose = cfg.hasOwnProperty('verbose') ? cfg.verbose : true;
        if (verbose) logData.call(this, 'Error from flow0 appeared !!!', cfg, msg, {}, store, {});
        throw new Error('Error from - flow0 - appeared !!!');
    } catch (err) {
        throw new Error('Error: ', err);
    }
}

//  ---------------------------------------------------------------------------
//  handling - prepare the initial status and parameter for the first request

async function flow1(msg={}, cfg={}, store={}, tb=new TimeBox(), ) {

    try {
        const verbose = cfg.hasOwnProperty('verbose') ? cfg.verbose : false;

        const dateUserSetFrom = msg.body.from ? msg.body.from : undefined;
        const dateUserSetTo = msg.body.to ? msg.body.to : undefined;

        if (dateUserSetFrom === undefined && dateUserSetTo && new Date(dateUserSetTo) < tb.yesterdayTimeStart) throw new Error('Date From is undefined and date To lay in the past !!!');
        if (dateUserSetFrom && dateUserSetTo && new Date(dateUserSetFrom).getTime() === new Date(dateUserSetTo).getTime()) throw new Error('Date From and date To are equal !!!');
        if (dateUserSetFrom && dateUserSetTo && new Date(dateUserSetFrom) > new Date(dateUserSetTo)) throw new Error('Date From is bigger than date To !!!');

        const dateNextStart = dateUserSetFrom ? tb.getThisDayStartAt(dateUserSetFrom) : tb.getDefaultStartAt();
        const dateThisStart = dateUserSetFrom ? tb.getThisStartAt(dateUserSetFrom) : tb.getDefaultStartAt();

        const dateNextEnd =
            dateUserSetTo
                ? (tb.getThisDayEndAt(dateNextStart) < new Date(dateUserSetTo))
                    ? tb.getThisDayEndAt(dateNextStart)
                    : dateUserSetTo
                : new Date(+(new Date(dateNextStart)) + 86399999);

        const options = {
            status: 200,
            orgId: msg.body.org_id ? msg.body.org_id : cfg.org_id,
            reqDateStart: new Date(dateThisStart).toJSON(),
            reqDateEnd: new Date(dateNextEnd).toJSON(),
            limit: cfg.limit ? cfg.limit : '200',
            offset: cfg.offset ? cfg.offset : '0',
            isVerbose: true,
        };
        const newStore = {
            iteration: 1,
            payload: {
                statusLastProcessed: 200,
                dateLastProcessedStart: new Date(dateNextStart).toJSON(),
                dateLastProcessedEnd: new Date(dateNextEnd).toJSON(),
                dateUserSetFrom: dateUserSetFrom,
                dateUserSetTo: dateUserSetTo,
            }
        }

        if (verbose) logData.call(this, 'greeting from flow1: ', cfg, msg, options, store, newStore);

        const results = await requestLogic.call(this, msg, cfg, store, options)

        return([newStore, results]);
    } catch (err) {
        throw new error('Error: ', err);
    }
}

//  ---------------------------------------------------------------------------
//  handling like - finally block - possibility for cleanup code
//  should never be called - for testing purpose and future extensions

async function flow2(msg={}, cfg={}, store={}, tb=new TimeBox(), ) {

    try {
        const verbose = cfg.hasOwnProperty('verbose') ? cfg.verbose : false;
        if (verbose) logData.call(this, 'greeting from flow2: ', cfg, msg, { status: 700 }, store, {});

        return([store,[{"type":"request-success","id":new Date().valueOf().toString(),"payload":{"items":[],"problems":null}}]]);
    } catch (err) {
        throw new error('Error: ', err);
    }

}

//  ---------------------------------------------------------------------------
//  handling - after initialization in flow1 - for all further requests

async function flow3(msg={}, cfg={}, store={}, tb=new TimeBox(), ) {

    try {
        const verbose = cfg.hasOwnProperty('verbose') ? cfg.verbose : false;

        const dateUserSetFrom = store.payload.dateUserSetFrom ? store.payload.dateUserSetFrom : undefined;
        const dateUserSetTo = store.payload.dateUserSetTo ? store.payload.dateUserSetTo : undefined;

        const dateNextStart = new Date(+(new Date(store.payload.dateLastProcessedStart)) + 86400000).toJSON();

        const probablyNextEnd = new Date(+(new Date(dateNextStart)) + 86399999)
        const dateNextEnd =
            dateUserSetTo
                ? (probablyNextEnd < new Date(dateUserSetTo))
                    ? probablyNextEnd
                    : dateUserSetTo
                : probablyNextEnd;

        const options = {
            status: 200,
            orgId: msg.body.org_id ? msg.body.org_id : cfg.org_id,
            reqDateStart: new Date(dateNextStart).toJSON(),
            reqDateEnd: new Date(dateNextEnd).toJSON(),
            limit: cfg.limit ? cfg.limit : '200',
            offset: '0',
            isVerbose: true,
        };
        const newStore = {
            iteration: 1 + store.iteration,
            payload: {
                statusLastProcessed: 200,
                dateLastProcessedStart: new Date(dateNextStart).toJSON(),
                dateLastProcessedEnd: new Date(dateNextEnd).toJSON(),
                dateUserSetFrom,
                dateUserSetTo,
            }
        }

        if (verbose) logData.call(this, 'greeting from flow3: ', cfg, msg, options, store, newStore);

        const results = await requestLogic.call(this, msg, cfg, store, options)

        return ([newStore, results]);
    } catch (err) {
        throw new error('Error: ', err);
    }
}

//  ---------------------------------------------------------------------------
//  Selection of the handling flow

async function contactEnfore(msg={}, cfg={}, snapshot={}, tb=new TimeBox(), ) {

    try {
        const verbose = cfg.hasOwnProperty('verbose') ? cfg.verbose : false;
        const callFlow = [flow0, flow1, flow2, flow3];
        let store = {};

        //  find the status
        for (let nextDay = 1; nextDay === 1; null ) {

        let type = 0;   //  default
        if (!store.hasOwnProperty('iteration')) {
            type = 1; nextDay = 1;  //  this is the first execution
        } else {
            const { statusLastProcessed, dateLastProcessedStart, dateLastProcessedEnd, dateUserSetFrom, dateUserSetTo } = store.payload;

            if (store.iteration > 0 &&
                statusLastProcessed === 200 &&
                new Date(dateLastProcessedEnd).getTime() === new Date(dateUserSetTo).getTime() || cfg.getFullSet === false
            ) { type = 2; nextDay = 0; } //  all things done...

            //  ---------------------------------------------------------------

            else if (store.iteration > 0 && statusLastProcessed === 200 && type !== 2) {
                type = 3; nextDay = 1;
            }; //  get next data...
        }

        if (type === 2) break;
        const resultArr = await callFlow[type].call(this, msg, cfg, store);
        store = resultArr[0];

        for (let ii = 0; ii < resultArr[1].length; ii++) {
            await this.emit('data', messages.newMessageWithBody(resultArr[1][ii]));
        }
    }
        await this.emit('end');

    } catch (err) {
        this.emit('error', err);
    }

}

//  ---------------------------------------------------------------------------

module.exports = {
    process: contactEnfore,
};
