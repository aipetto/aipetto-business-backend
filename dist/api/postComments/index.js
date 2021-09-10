"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/post-comments`, require('./postCommentsCreate').default);
    app.put(`/tenant/:tenantId/post-comments/:id`, require('./postCommentsUpdate').default);
    app.post(`/tenant/:tenantId/post-comments/import`, require('./postCommentsImport').default);
    app.delete(`/tenant/:tenantId/post-comments`, require('./postCommentsDestroy').default);
    app.get(`/tenant/:tenantId/post-comments/autocomplete`, require('./postCommentsAutocomplete').default);
    app.get(`/tenant/:tenantId/post-comments`, require('./postCommentsList').default);
    app.get(`/tenant/:tenantId/post-comments/:id`, require('./postCommentsFind').default);
};
//# sourceMappingURL=index.js.map