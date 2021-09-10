"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/post-categories`, require('./postCategoriesCreate').default);
    app.put(`/tenant/:tenantId/post-categories/:id`, require('./postCategoriesUpdate').default);
    app.post(`/tenant/:tenantId/post-categories/import`, require('./postCategoriesImport').default);
    app.delete(`/tenant/:tenantId/post-categories`, require('./postCategoriesDestroy').default);
    app.get(`/tenant/:tenantId/post-categories/autocomplete`, require('./postCategoriesAutocomplete').default);
    app.get(`/post-categories`, require('./postCategoriesList').default);
    app.get(`/tenant/:tenantId/post-categories/:id`, require('./postCategoriesFind').default);
};
//# sourceMappingURL=index.js.map