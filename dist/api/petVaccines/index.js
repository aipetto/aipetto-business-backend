"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/pet-vaccines`, require('./petVaccinesCreate').default);
    app.put(`/tenant/:tenantId/pet-vaccines/:id`, require('./petVaccinesUpdate').default);
    app.post(`/tenant/:tenantId/pet-vaccines/import`, require('./petVaccinesImport').default);
    app.delete(`/tenant/:tenantId/pet-vaccines`, require('./petVaccinesDestroy').default);
    app.get(`/tenant/:tenantId/pet-vaccines/autocomplete`, require('./petVaccinesAutocomplete').default);
    app.get(`/tenant/:tenantId/pet-vaccines`, require('./petVaccinesList').default);
    app.get(`/tenant/:tenantId/pet-vaccines/:id`, require('./petVaccinesFind').default);
};
//# sourceMappingURL=index.js.map