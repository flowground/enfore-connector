
const axios = require('axios');

const { requestAuthentication, requestAuthorization, } = require('./request-auth');
const { MSG, SERVER, VALUES, } = require('./config');

//  ---------------------------------------------------------------------------
//  Request server for data

function requestDataEndpoint(inData) {
    return new Promise((resolve, reject) => {

        const { accessToken, reqDataEndpoint, reqDateStart, reqDateEnd, limit, offset, isVerbose, orgId, method } = inData;
        if (isVerbose) { this.logger.info('---R1M: %s %s %s %s %s %s', accessToken.slice(1,5) + '****', reqDataEndpoint, reqDateStart, reqDateEnd, limit, offset, ); }

        const config = {
            timeout: 8000,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'cache-control': 'no-cache'
            },
            params: {
                from: reqDateStart,
                to: reqDateEnd,
                limit,
                offset,
            }
        };
        
        axios.get(reqDataEndpoint, config)
            .then((response) => { resolve({ type: MSG.REGISTER_SUCCESS, id: new Date().valueOf().toString(), method, orgId,
                                            from: reqDateStart, to: reqDateEnd, limit, offset, payload: response.data }); })
            .catch((error) => { reject({ type: MSG.REGISTER_FAIL, error: error, failType: MSG.FAIL_AUTHENTICATION, }); });
    });
}

//  ---------------------------------------------------------------------------
//  Structure the necessary requests for blocks with limit, offset and time handling

async function requestLogic(msg, cfg, store={}, options) {

    // const isVerbose = true;

    try {
        const isVerbose = process.env.debug || cfg.verbose;
        
        // cfg.endpServer become the user selected database endpoint
        cfg.authServer = cfg.useDefaultAuth ? cfg.serverBaseUrl + SERVER.AUTH : cfg.serverBaseUrl + cfg.serverAuthCustom;
        cfg.endpServer = cfg.useDefaultErp ? cfg.serverBaseUrl + SERVER.ERP : cfg.serverBaseUrl + cfg.serverErpCustom;

        if (isVerbose) {
            this.logger.info('---requestLogic: isVerbose userName password cfg.authServer cfg.endpServer options.orgId: ',
                isVerbose, cfg.userName, cfg.password.slice(1,5) + '****', cfg.authServer, cfg.endpServer, options.orgId );
        }
        //  -----------------------------------------------

        const data0 = { authEndpointLogin: cfg.authServer + '/login', username: cfg.userName, password: cfg.password, isVerbose: isVerbose };
        // if (isVerbose) { this.logger.info('---data1:\n', JSON.stringify(data0)); }
        const data1 = await requestAuthentication.call(this, data0);
        // if (isVerbose) { this.logger.info('---data1:\n', JSON.stringify(data1)); }

        const data2 = { authEndpointAuthorize: cfg.authServer + '/authorize', orgId: options.orgId, accessToken: data1.payload.accessToken, isVerbose: isVerbose };
        const data3 = await requestAuthorization.call(this, data2);
        // if (isVerbose) { this.logger.info('---data3:\n', JSON.stringify(data3)); }

        const data4 = {
            accessToken: data3.payload.accessToken,
            reqDataEndpoint: cfg.endpServer + '/org/' + options.orgId + '/invoices',
            orgId: options.orgId,
            reqDateStart: options.reqDateStart,
            reqDateEnd: options.reqDateEnd,
            limit: options.limit,
            offset: options.offset,
            isVerbose: isVerbose,
            method: VALUES.methodGetInvoices,
        }
        // if (isVerbose) { this.logger.info('---data4:\n', JSON.stringify(data4)); }
        
        let results = [];
        let intFixedLimit = parseInt(options.limit, 10);
        for (let next = 1; next === 1; null ) {
            const result = await requestDataEndpoint.call(this, data4);
            if (result.type === MSG.REGISTER_SUCCESS) { results.push(result) };
            if (result.type === MSG.REGISTER_SUCCESS && result.payload.items.length < intFixedLimit) {
                next = 0;
            };
            if (result.type === MSG.REGISTER_SUCCESS && result.payload.items.length >= intFixedLimit) {
                data4.offset = String((parseInt(data4.offset, 10)) + intFixedLimit);
                next = cfg.getFullSet ? 1 : 0;
            };
        }

        return (results);
 
    } catch (err) {
        this.logger.info('---err from request-invoices: ', err);
        this.emit('error', err);
    }
}

//  ---------------------------------------------------------------------------

module.exports = {
    requestLogic,
};

