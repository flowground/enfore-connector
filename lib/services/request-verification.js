/**
 * flowground :- mVISE iPaaS / enforce-universal-connector
 * Copyright © 2020, mVISE AG
 * contact: info@mvise.de
 *
 * All files of this connector are licensed under the Apache 2.0 License. For details
 * see the file LICENSE on the top-level directory.
 */

const { requestAuthentication, requestAuthorization, } = require('./request-auth');
const { SERVER, } = require('./config');

//  ---------------------------------------------------------------------------

async function requestVerification(msg, cfg, snapshot = {}, options) {

    // const isVerbose = false;

    try {
        const isVerbose = process.env.debug || cfg.verbose;

        cfg.authServer = cfg.useDefaultAuth ? cfg.serverBaseUrl + SERVER.AUTH : cfg.serverBaseUrl + cfg.serverAuthCustom;

        if (isVerbose) {
            this.logger.info('---requestLogic: isVerbose userName password cfg.authServer cfg.endpServer cfg.authOrgId: ',
                isVerbose, cfg.userName, cfg.password.slice(1,5) + '****', cfg.authServer, cfg.endpServer, cfg.authOrgId);
        }
        //  -------------------------------------------------------------------

        const data0 = { authEndpointLogin: cfg.authServer + '/login', username: cfg.userName, password: cfg.password, isVerbose: isVerbose };
        // if (isVerbose) { this.logger.info('---data1:\n', JSON.stringify(data0)); }
        const data1 = await requestAuthentication.call(this, data0);
        // if (isVerbose) { this.logger.info('---data1:\n', JSON.stringify(data1)); }

        const data2 = { authEndpointAuthorize: cfg.authServer + '/authorize', orgId: cfg.authOrgId, accessToken: data1.payload.accessToken, isVerbose: isVerbose };
        const data3 = await requestAuthorization.call(this, data2);
        // if (isVerbose) { this.logger.info('---data3:\n', JSON.stringify(data3)); }

        const data4 = { accessToken: data3.payload.accessToken.slice(1,5) + '****', };

        return data4;

    } catch (err) {
        this.logger.info('---Error:\n', err);
        throw new Error('error: ', err);
    }
}

//  ---------------------------------------------------------------------------

module.exports = {
    requestVerification,
};

