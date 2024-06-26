"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/pet`, require('./petCreate').default);
    app.post(`/tenant/:tenantId/petNew`, require('./petCreateNew').default);
    app.put(`/tenant/:tenantId/pet/:id`, require('./petUpdate').default);
    app.post(`/tenant/:tenantId/pet/import`, require('./petImport').default);
    app.delete(`/tenant/:tenantId/pet`, require('./petDestroy').default);
    app.get(`/tenant/:tenantId/pet/autocomplete`, require('./petAutocomplete').default);
    app.get(`/tenant/:tenantId/pet`, require('./petList').default);
    app.get(`/tenant/:tenantId/pet/:id`, require('./petFind').default);
};
//# sourceMappingURL=index.js.map