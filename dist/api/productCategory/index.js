"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/product-category`, require('./productCategoryCreate').default);
    app.put(`/tenant/:tenantId/product-category/:id`, require('./productCategoryUpdate').default);
    app.post(`/tenant/:tenantId/product-category/import`, require('./productCategoryImport').default);
    app.delete(`/tenant/:tenantId/product-category`, require('./productCategoryDestroy').default);
    app.get(`/product-category/autocomplete`, require('./productCategoryAutocomplete').default);
    app.get(`/product-category`, require('./productCategoryList').default);
    app.get(`/tenant/:tenantId/product-category/:id`, require('./productCategoryFind').default);
};
//# sourceMappingURL=index.js.map