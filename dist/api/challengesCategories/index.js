"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/challenges-categories`, require('./challengesCategoriesCreate').default);
    app.put(`/tenant/:tenantId/challenges-categories/:id`, require('./challengesCategoriesUpdate').default);
    app.post(`/tenant/:tenantId/challenges-categories/import`, require('./challengesCategoriesImport').default);
    app.delete(`/tenant/:tenantId/challenges-categories`, require('./challengesCategoriesDestroy').default);
    app.get(`/tenant/:tenantId/challenges-categories/autocomplete`, require('./challengesCategoriesAutocomplete').default);
    app.get(`/tenant/:tenantId/challenges-categories`, require('./challengesCategoriesList').default);
    app.get(`/tenant/:tenantId/challenges-categories/:id`, require('./challengesCategoriesFind').default);
};
//# sourceMappingURL=index.js.map