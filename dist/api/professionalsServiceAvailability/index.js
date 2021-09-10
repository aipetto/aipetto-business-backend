"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/professionals-service-availability`, require('./professionalsServiceAvailabilityCreate').default);
    app.put(`/tenant/:tenantId/professionals-service-availability/:id`, require('./professionalsServiceAvailabilityUpdate').default);
    app.post(`/tenant/:tenantId/professionals-service-availability/import`, require('./professionalsServiceAvailabilityImport').default);
    app.delete(`/tenant/:tenantId/professionals-service-availability`, require('./professionalsServiceAvailabilityDestroy').default);
    app.get(`/tenant/:tenantId/professionals-service-availability/autocomplete`, require('./professionalsServiceAvailabilityAutocomplete').default);
    app.get(`/tenant/:tenantId/professionals-service-availability`, require('./professionalsServiceAvailabilityList').default);
    app.get(`/tenant/:tenantId/professionals-service-availability/:id`, require('./professionalsServiceAvailabilityFind').default);
};
//# sourceMappingURL=index.js.map