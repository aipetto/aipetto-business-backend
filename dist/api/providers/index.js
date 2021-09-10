"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/providers`, require('./providersCreate').default);
    app.put(`/tenant/:tenantId/providers/:id`, require('./providersUpdate').default);
    app.post(`/tenant/:tenantId/providers/import`, require('./providersImport').default);
    app.delete(`/tenant/:tenantId/providers`, require('./providersDestroy').default);
    app.get(`/tenant/:tenantId/providers/autocomplete`, require('./providersAutocomplete').default);
    app.get(`/tenant/:tenantId/providers`, require('./providersList').default);
    app.get(`/tenant/:tenantId/providers/:id`, require('./providersFind').default);
};
//# sourceMappingURL=index.js.map