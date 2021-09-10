"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/messages`, require('./messagesCreate').default);
    app.put(`/tenant/:tenantId/messages/:id`, require('./messagesUpdate').default);
    app.post(`/tenant/:tenantId/messages/import`, require('./messagesImport').default);
    app.delete(`/tenant/:tenantId/messages`, require('./messagesDestroy').default);
    app.get(`/tenant/:tenantId/messages/autocomplete`, require('./messagesAutocomplete').default);
    app.get(`/tenant/:tenantId/messages`, require('./messagesList').default);
    app.get(`/tenant/:tenantId/messages/:id`, require('./messagesFind').default);
};
//# sourceMappingURL=index.js.map