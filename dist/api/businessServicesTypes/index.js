"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/business-services-types`, require('./businessServicesTypesCreate').default);
    app.put(`/tenant/:tenantId/business-services-types/:id`, require('./businessServicesTypesUpdate').default);
    app.post(`/tenant/:tenantId/business-services-types/import`, require('./businessServicesTypesImport').default);
    app.delete(`/tenant/:tenantId/business-services-types`, require('./businessServicesTypesDestroy').default);
    app.get(`/business-services-types/autocomplete`, require('./businessServicesTypesAutocomplete').default);
    app.get(`/business-services-types`, require('./businessServicesTypesList').default);
    app.get(`/business-services-types/:id`, require('./businessServicesTypesFind').default);
};
//# sourceMappingURL=index.js.map