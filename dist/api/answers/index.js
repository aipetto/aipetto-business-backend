"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/answers`, require('./answersCreate').default);
    app.put(`/tenant/:tenantId/answers/:id`, require('./answersUpdate').default);
    app.post(`/tenant/:tenantId/answers/import`, require('./answersImport').default);
    app.delete(`/tenant/:tenantId/answers`, require('./answersDestroy').default);
    app.get(`/tenant/:tenantId/answers/autocomplete`, require('./answersAutocomplete').default);
    app.get(`/tenant/:tenantId/answers`, require('./answersList').default);
    app.get(`/tenant/:tenantId/answers/:id`, require('./answersFind').default);
};
//# sourceMappingURL=index.js.map