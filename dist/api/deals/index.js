"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/deals`, require('./dealsCreate').default);
    app.put(`/tenant/:tenantId/deals/:id`, require('./dealsUpdate').default);
    app.post(`/tenant/:tenantId/deals/import`, require('./dealsImport').default);
    app.delete(`/tenant/:tenantId/deals`, require('./dealsDestroy').default);
    app.get(`/tenant/:tenantId/deals/autocomplete`, require('./dealsAutocomplete').default);
    app.get(`/tenant/:tenantId/deals`, require('./dealsList').default);
    app.get(`/tenant/:tenantId/deals/:id`, require('./dealsFind').default);
};
//# sourceMappingURL=index.js.map