//  initialize configuration file

const MSG = {
    REGISTER_SUCCESS: 'request-success',
    REGISTER_FAIL: 'request-fail',
    FAIL_AUTHENTICATION: 'request-fail-authentication',
    FAIL_AUTHORIZATION: 'request-fail-authorization',
    FAIL_REQUEST_ACTION: 'request-fail-dataAction',
    FAIL_PROCESS_ACTION: 'request-fail-processAction',
};

const SERVER = {
    AUTH: '/auth',
    CONTACTS: '/contacts',
    ERP: '/erp',
    PROMOTIONS: '/promotions',
};

const VALUES = {
    "methodGetInvoices": "get-orgid-invoices",
    "methodGetIndividual": "get-orgid-individual",
    "font_size_tiny": 12,
};

module.exports = {
    MSG,
    SERVER,
    VALUES,
};
