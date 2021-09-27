"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/business-services-prices`, require('./businessServicesPricesCreate').default);
    app.put(`/tenant/:tenantId/business-services-prices/:id`, require('./businessServicesPricesUpdate').default);
    app.post(`/tenant/:tenantId/business-services-prices/import`, require('./businessServicesPricesImport').default);
    app.delete(`/tenant/:tenantId/business-services-prices`, require('./businessServicesPricesDestroy').default);
    app.get(`/tenant/:tenantId/business-services-prices/autocomplete`, require('./businessServicesPricesAutocomplete').default);
    app.get(`/tenant/:tenantId/business-services-prices`, require('./businessServicesPricesList').default);
    app.get(`/tenant/:tenantId/business-services-prices/:id`, require('./businessServicesPricesFind').default);
};
//# sourceMappingURL=index.js.map