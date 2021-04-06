"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/pet-types`, require('./petTypesCreate').default);
    app.put(`/tenant/:tenantId/pet-types/:id`, require('./petTypesUpdate').default);
    app.post(`/tenant/:tenantId/pet-types/import`, require('./petTypesImport').default);
    app.delete(`/tenant/:tenantId/pet-types`, require('./petTypesDestroy').default);
    app.get(`/tenant/:tenantId/pet-types/autocomplete`, require('./petTypesAutocomplete').default);
    app.get(`/tenant/:tenantId/pet-types`, require('./petTypesList').default);
    app.get(`/tenant/:tenantId/pet-types/:id`, require('./petTypesFind').default);
};
//# sourceMappingURL=index.js.map