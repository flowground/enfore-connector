
const axios = require('axios');
const base64 = require('base-64');

const { MSG, } = require('./config');

//  ---------------------------------------------------------------------------
//  Get the accessToken for authorization

function requestAuthentication(inData) {
    return new Promise((resolve, reject) => {

        const { authEndpointLogin, username, password, isVerbose, } = inData;
        if (isVerbose) { this.logger.info('---R1M: %s %s %s', authEndpointLogin, username, password.slice(1,5) + '****'); }

        const config = {
            timeout: 8000,
            headers: {
                'Accept': '*/*',
                'Authorization': 'Basic ' + base64.encode(username + ":" + password)
            }
        };
        axios.get(authEndpointLogin, config)
            .then((response) => { resolve({ type: MSG.REGISTER_SUCCESS, payload: response.data }); })
            .catch((error) => { reject({ type: MSG.REGISTER_FAIL, error: error, failType: MSG.FAIL_AUTHENTICATION, }); });
    });
}

//  ---------------------------------------------------------------------------
//  Get the accessToken for the data endpoint

function requestAuthorization(inData) {
    return new Promise((resolve, reject) => {
        const { authEndpointAuthorize, orgId, accessToken, isVerbose, } = inData;
        if (isVerbose) { this.logger.info('---R2M: %s %s %s', authEndpointAuthorize, orgId, accessToken.slice(1,5) + '****'); }

        const config = {
            timeout: 8000,
            headers: {
                'Accept': '*/*',
                'Authorization': 'Bearer ' + accessToken
            }
        };
        axios.get(authEndpointAuthorize + '/' + orgId, config)
            .then((response) => { resolve({ type: MSG.REGISTER_SUCCESS, payload: response.data }); })
            .catch((error) => { reject({ type: MSG.REGISTER_FAIL, error: error, failType: MSG.FAIL_AUTHORIZATION }); });
    });
}

//  ---------------------------------------------------------------------------

module.exports = {
    requestAuthentication,
    requestAuthorization,
};
