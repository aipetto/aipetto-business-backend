"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/points-challenges`, require('./pointsChallengesCreate').default);
    app.put(`/tenant/:tenantId/points-challenges/:id`, require('./pointsChallengesUpdate').default);
    app.post(`/tenant/:tenantId/points-challenges/import`, require('./pointsChallengesImport').default);
    app.delete(`/tenant/:tenantId/points-challenges`, require('./pointsChallengesDestroy').default);
    app.get(`/tenant/:tenantId/points-challenges/autocomplete`, require('./pointsChallengesAutocomplete').default);
    app.get(`/tenant/:tenantId/points-challenges`, require('./pointsChallengesList').default);
    app.get(`/tenant/:tenantId/points-challenges/:id`, require('./pointsChallengesFind').default);
};
//# sourceMappingURL=index.js.map