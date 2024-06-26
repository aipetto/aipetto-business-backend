"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/customer`, require('./customerCreate').default);
    app.put(`/tenant/:tenantId/customer/:id`, require('./customerUpdate').default);
    app.post(`/tenant/:tenantId/customer/import`, require('./customerImport').default);
    app.delete(`/tenant/:tenantId/customer`, require('./customerDestroy').default);
    app.get(`/tenant/:tenantId/customer/autocomplete`, require('./customerAutocomplete').default);
    app.get(`/tenant/:tenantId/customer`, require('./customerList').default);
    app.get(`/tenant/:tenantId/customer/:id`, require('./customerFind').default);
};
//# sourceMappingURL=index.js.map