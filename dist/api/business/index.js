"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/business`, require('./businessCreate').default);
    app.put(`/tenant/:tenantId/business/:id`, require('./businessUpdate').default);
    app.post(`/tenant/:tenantId/business/import`, require('./businessImport').default);
    app.delete(`/tenant/:tenantId/business`, require('./businessDestroy').default);
    app.get(`/tenant/:tenantId/business/autocomplete`, require('./businessAutocomplete').default);
    app.get(`/tenant/:tenantId/business`, require('./businessList').default);
    app.get(`/tenant/:tenantId/business/:id`, require('./businessFind').default);
};
//# sourceMappingURL=index.js.map