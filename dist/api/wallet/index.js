"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/wallet`, require('./walletCreate').default);
    app.put(`/tenant/:tenantId/wallet/:id`, require('./walletUpdate').default);
    app.post(`/tenant/:tenantId/wallet/import`, require('./walletImport').default);
    app.delete(`/tenant/:tenantId/wallet`, require('./walletDestroy').default);
    app.get(`/tenant/:tenantId/wallet/autocomplete`, require('./walletAutocomplete').default);
    app.get(`/tenant/:tenantId/wallet`, require('./walletList').default);
    app.get(`/tenant/:tenantId/wallet/:id`, require('./walletFind').default);
};
//# sourceMappingURL=index.js.map