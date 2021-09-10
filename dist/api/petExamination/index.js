"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/pet-examination`, require('./petExaminationCreate').default);
    app.put(`/tenant/:tenantId/pet-examination/:id`, require('./petExaminationUpdate').default);
    app.post(`/tenant/:tenantId/pet-examination/import`, require('./petExaminationImport').default);
    app.delete(`/tenant/:tenantId/pet-examination`, require('./petExaminationDestroy').default);
    app.get(`/tenant/:tenantId/pet-examination/autocomplete`, require('./petExaminationAutocomplete').default);
    app.get(`/tenant/:tenantId/pet-examination`, require('./petExaminationList').default);
    app.get(`/tenant/:tenantId/pet-examination/:id`, require('./petExaminationFind').default);
};
//# sourceMappingURL=index.js.map