"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/landing-survey`, require('./landingSurveyCreate').default);
    app.put(`/tenant/:tenantId/landing-survey/:id`, require('./landingSurveyUpdate').default);
    app.post(`/tenant/:tenantId/landing-survey/import`, require('./landingSurveyImport').default);
    app.delete(`/tenant/:tenantId/landing-survey`, require('./landingSurveyDestroy').default);
    app.get(`/tenant/:tenantId/landing-survey/autocomplete`, require('./landingSurveyAutocomplete').default);
    app.get(`/tenant/:tenantId/landing-survey`, require('./landingSurveyList').default);
    app.get(`/tenant/:tenantId/landing-survey/:id`, require('./landingSurveyFind').default);
};
//# sourceMappingURL=index.js.map