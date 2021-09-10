"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/city`, require('./cityCreate').default);
    app.put(`/tenant/:tenantId/city/:id`, require('./cityUpdate').default);
    app.post(`/tenant/:tenantId/city/import`, require('./cityImport').default);
    app.delete(`/tenant/:tenantId/city`, require('./cityDestroy').default);
    app.get(`/city/autocomplete`, require('./cityAutocomplete').default);
    app.get(`/city`, require('./cityList').default);
    app.get(`/tenant/:tenantId/city/:id`, require('./cityFind').default);
};
//# sourceMappingURL=index.js.map