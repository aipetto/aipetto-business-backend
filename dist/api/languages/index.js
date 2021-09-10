"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/languages`, require('./languagesCreate').default);
    app.put(`/tenant/:tenantId/languages/:id`, require('./languagesUpdate').default);
    app.post(`/tenant/:tenantId/languages/import`, require('./languagesImport').default);
    app.delete(`/tenant/:tenantId/languages`, require('./languagesDestroy').default);
    app.get(`/languages/autocomplete`, require('./languagesAutocomplete').default);
    app.get(`/languages`, require('./languagesList').default);
    app.get(`/tenant/:tenantId/languages/:id`, require('./languagesFind').default);
};
//# sourceMappingURL=index.js.map