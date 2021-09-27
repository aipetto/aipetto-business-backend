"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/business-payment-cycle`, require('./businessPaymentCycleCreate').default);
    app.put(`/tenant/:tenantId/business-payment-cycle/:id`, require('./businessPaymentCycleUpdate').default);
    app.post(`/tenant/:tenantId/business-payment-cycle/import`, require('./businessPaymentCycleImport').default);
    app.delete(`/tenant/:tenantId/business-payment-cycle`, require('./businessPaymentCycleDestroy').default);
    app.get(`/tenant/:tenantId/business-payment-cycle/autocomplete`, require('./businessPaymentCycleAutocomplete').default);
    app.get(`/tenant/:tenantId/business-payment-cycle`, require('./businessPaymentCycleList').default);
    app.get(`/tenant/:tenantId/business-payment-cycle/:id`, require('./businessPaymentCycleFind').default);
};
//# sourceMappingURL=index.js.map