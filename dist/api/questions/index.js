"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/questions`, require('./questionsCreate').default);
    app.put(`/tenant/:tenantId/questions/:id`, require('./questionsUpdate').default);
    app.post(`/tenant/:tenantId/questions/import`, require('./questionsImport').default);
    app.delete(`/tenant/:tenantId/questions`, require('./questionsDestroy').default);
    app.get(`/tenant/:tenantId/questions/autocomplete`, require('./questionsAutocomplete').default);
    app.get(`/tenant/:tenantId/questions`, require('./questionsList').default);
    app.get(`/tenant/:tenantId/questions/:id`, require('./questionsFind').default);
};
//# sourceMappingURL=index.js.map