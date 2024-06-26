"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/posts`, require('./postsCreate').default);
    app.put(`/tenant/:tenantId/posts/:id`, require('./postsUpdate').default);
    app.post(`/tenant/:tenantId/posts/import`, require('./postsImport').default);
    app.delete(`/tenant/:tenantId/posts`, require('./postsDestroy').default);
    app.get(`/tenant/:tenantId/posts/autocomplete`, require('./postsAutocomplete').default);
    app.get(`/tenant/:tenantId/posts`, require('./postsList').default);
    app.get(`/tenant/:tenantId/posts/:id`, require('./postsFind').default);
};
//# sourceMappingURL=index.js.map