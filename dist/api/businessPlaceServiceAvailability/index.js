"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/business-place-service-availability`, require('./businessPlaceServiceAvailabilityCreate').default);
    app.put(`/tenant/:tenantId/business-place-service-availability/:id`, require('./businessPlaceServiceAvailabilityUpdate').default);
    app.post(`/tenant/:tenantId/business-place-service-availability/import`, require('./businessPlaceServiceAvailabilityImport').default);
    app.delete(`/tenant/:tenantId/business-place-service-availability`, require('./businessPlaceServiceAvailabilityDestroy').default);
    app.get(`/tenant/:tenantId/business-place-service-availability/autocomplete`, require('./businessPlaceServiceAvailabilityAutocomplete').default);
    app.get(`/tenant/:tenantId/business-place-service-availability`, require('./businessPlaceServiceAvailabilityList').default);
    app.get(`/tenant/:tenantId/business-place-service-availability/:id`, require('./businessPlaceServiceAvailabilityFind').default);
};
//# sourceMappingURL=index.js.map