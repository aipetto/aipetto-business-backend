"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/state`, require('./stateCreate').default);
    app.put(`/tenant/:tenantId/state/:id`, require('./stateUpdate').default);
    app.post(`/tenant/:tenantId/state/import`, require('./stateImport').default);
    app.delete(`/tenant/:tenantId/state`, require('./stateDestroy').default);
    app.get(`/state/autocomplete`, require('./stateAutocomplete').default);
    app.get(`/tenant/:tenantId/state`, require('./stateList').default);
    app.get(`/tenant/:tenantId/state/:id`, require('./stateFind').default);
};
//# sourceMappingURL=index.js.map