"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/service-reservation`, require('./serviceReservationCreate').default);
    app.put(`/tenant/:tenantId/service-reservation/:id`, require('./serviceReservationUpdate').default);
    app.post(`/tenant/:tenantId/service-reservation/import`, require('./serviceReservationImport').default);
    app.delete(`/tenant/:tenantId/service-reservation`, require('./serviceReservationDestroy').default);
    app.get(`/tenant/:tenantId/service-reservation/autocomplete`, require('./serviceReservationAutocomplete').default);
    app.get(`/tenant/:tenantId/service-reservation`, require('./serviceReservationList').default);
    app.get(`/tenant/:tenantId/service-reservation/:id`, require('./serviceReservationFind').default);
};
//# sourceMappingURL=index.js.map