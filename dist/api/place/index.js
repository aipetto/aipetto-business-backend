"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/place`, require('./placeCreate').default);
    app.put(`/tenant/:tenantId/place/:id`, require('./placeUpdate').default);
    app.post(`/tenant/:tenantId/place/import`, require('./placeImport').default);
    app.delete(`/tenant/:tenantId/place`, require('./placeDestroy').default);
    app.get(`/tenant/:tenantId/place/autocomplete`, require('./placeAutocomplete').default);
    app.get(`/tenant/:tenantId/place`, require('./placeList').default);
    app.get(`/place/nearby`, require('./findPlacesNearbyByGeolocation').default);
    app.get(`/tenant/:tenantId/place/:id`, require('./placeFind').default);
};
//# sourceMappingURL=index.js.map