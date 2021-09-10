"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/discounts`, require('./discountsCreate').default);
    app.put(`/tenant/:tenantId/discounts/:id`, require('./discountsUpdate').default);
    app.post(`/tenant/:tenantId/discounts/import`, require('./discountsImport').default);
    app.delete(`/tenant/:tenantId/discounts`, require('./discountsDestroy').default);
    app.get(`/tenant/:tenantId/discounts/autocomplete`, require('./discountsAutocomplete').default);
    app.get(`/tenant/:tenantId/discounts`, require('./discountsList').default);
    app.get(`/tenant/:tenantId/discounts/:id`, require('./discountsFind').default);
};
//# sourceMappingURL=index.js.map