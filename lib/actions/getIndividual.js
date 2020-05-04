
const messages = require('elasticio-node').messages;
const { requestLogic, } = require('./../services/request-individual');

//  -------------------------------------------------------
//  Initial parameter setup for request

async function getIndividual(msg, cfg, snapshot={}) {
    
    const { getFullSet, limit, offset, } = cfg;
    const authOrgId = msg.body.hasOwnProperty('org_id') ? msg.body.org_id :
        cfg.hasOwnProperty('org_id') ? cfg.org_id : undefined;
    if (authOrgId === undefined) { throw new Error('The org_id is required for request!');
        } else { cfg.authOrgId = authOrgId; } 

    const options = {
        method: 'get-orgid-individual',
        getFullSet: getFullSet,
        limit: limit ? limit : '1000',
        offset: offset ? offset : '0',
    };
    
    const resArr = await requestLogic.call(this, {}, cfg, {}, options);
    
    for (let i = 0; i < resArr.length; i++) {
        await this.emit('data', messages.newMessageWithBody(resArr[i]));
    }
    await this.emit('end');
}

//  -------------------------------------------------------

module.exports = {
    process: getIndividual,
}
