"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/contacts`, require('./contactsCreate').default);
    app.put(`/tenant/:tenantId/contacts/:id`, require('./contactsUpdate').default);
    app.post(`/tenant/:tenantId/contacts/import`, require('./contactsImport').default);
    app.delete(`/tenant/:tenantId/contacts`, require('./contactsDestroy').default);
    app.get(`/tenant/:tenantId/contacts/autocomplete`, require('./contactsAutocomplete').default);
    app.get(`/tenant/:tenantId/contacts`, require('./contactsList').default);
    app.get(`/tenant/:tenantId/contacts/:id`, require('./contactsFind').default);
};
//# sourceMappingURL=index.js.map