"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/breed`, require('./breedCreate').default);
    app.put(`/tenant/:tenantId/breed/:id`, require('./breedUpdate').default);
    app.post(`/tenant/:tenantId/breed/import`, require('./breedImport').default);
    app.delete(`/tenant/:tenantId/breed`, require('./breedDestroy').default);
    app.get(`/breed/autocomplete`, require('./breedAutocomplete').default);
    app.get(`/breed`, require('./breedList').default);
    app.get(`/breed/:id`, require('./breedFind').default);
};
//# sourceMappingURL=index.js.map