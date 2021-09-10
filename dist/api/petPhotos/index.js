"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/pet-photos`, require('./petPhotosCreate').default);
    app.put(`/tenant/:tenantId/pet-photos/:id`, require('./petPhotosUpdate').default);
    app.post(`/tenant/:tenantId/pet-photos/import`, require('./petPhotosImport').default);
    app.delete(`/tenant/:tenantId/pet-photos`, require('./petPhotosDestroy').default);
    app.get(`/tenant/:tenantId/pet-photos/autocomplete`, require('./petPhotosAutocomplete').default);
    app.get(`/tenant/:tenantId/pet-photos`, require('./petPhotosList').default);
    app.get(`/tenant/:tenantId/pet-photos/:id`, require('./petPhotosFind').default);
};
//# sourceMappingURL=index.js.map