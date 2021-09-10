"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/country`, require('./countryCreate').default);
    app.put(`/tenant/:tenantId/country/:id`, require('./countryUpdate').default);
    app.post(`/tenant/:tenantId/country/import`, require('./countryImport').default);
    app.delete(`/tenant/:tenantId/country`, require('./countryDestroy').default);
    app.get(`/country/autocomplete`, require('./countryAutocomplete').default);
    app.get(`/country`, require('./countryList').default);
    app.get(`/country/:id`, require('./countryFind').default);
};
//# sourceMappingURL=index.js.map