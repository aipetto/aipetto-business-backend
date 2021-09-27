"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/business-category`, require('./businessCategoryCreate').default);
    app.put(`/tenant/:tenantId/business-category/:id`, require('./businessCategoryUpdate').default);
    app.post(`/tenant/:tenantId/business-category/import`, require('./businessCategoryImport').default);
    app.delete(`/tenant/:tenantId/business-category`, require('./businessCategoryDestroy').default);
    app.get(`/business-category/autocomplete`, require('./businessCategoryAutocomplete').default);
    app.get(`/business-category`, require('./businessCategoryList').default);
    app.get(`/tenant/:tenantId/business-category/:id`, require('./businessCategoryFind').default);
};
//# sourceMappingURL=index.js.map