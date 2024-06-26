"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/order`, require('./orderCreate').default);
    app.put(`/tenant/:tenantId/order/:id`, require('./orderUpdate').default);
    app.post(`/tenant/:tenantId/order/import`, require('./orderImport').default);
    app.delete(`/tenant/:tenantId/order`, require('./orderDestroy').default);
    app.get(`/tenant/:tenantId/order/autocomplete`, require('./orderAutocomplete').default);
    app.get(`/tenant/:tenantId/order`, require('./orderList').default);
    app.get(`/tenant/:tenantId/order/:id`, require('./orderFind').default);
};
//# sourceMappingURL=index.js.map