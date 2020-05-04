
const { requestVerification, } = require('./lib/services/request-verification');

module.exports = async function verify(credentials, cb) {

    try {
        const { serverBaseUrl,
                useDefaultAuth,
                serverAuthCustom,
                userName,
                password,
                authOrgId, } = credentials;
        
        const options = {
            method: 'verify-credentials',
        };

        if (!serverBaseUrl) throw new Error('Server Base Url is missing');
        if (!userName) throw new Error('User Name is missing');
        if (!password) throw new Error('Password is missing');
        if (!authOrgId) throw new Error('OrgId is missing');   
        if (useDefaultAuth === false && !serverAuthCustom) throw new Error('Custom Server Auth URL is missing');

        const res = await requestVerification.call(this, {}, credentials, {}, options);
        const logPassword = String(password.slice(1,5) + '****');
        const logCredentials = Object.assign({}, credentials, { password: logPassword });
        await this.logger.info('---Credentials for verification %j', logCredentials);
        await this.logger.info('---Options: %j', options);
        await this.logger.info('---Verification response: %j', res);
        
        cb(null, { verified: true });
    } catch (e) {
        await this.logger.error('Credentials catch passed for verification %j', logCredentials);
        await this.logger.error('Credential test criteria have not been met: ' + e.name + ': ' + e.message);
        cb(null, { verified: false });
    }
};
