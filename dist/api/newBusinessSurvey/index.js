"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/new-business-survey`, require('./newBusinessSurveyCreate').default);
    app.put(`/tenant/:tenantId/new-business-survey/:id`, require('./newBusinessSurveyUpdate').default);
    app.post(`/tenant/:tenantId/new-business-survey/import`, require('./newBusinessSurveyImport').default);
    app.delete(`/tenant/:tenantId/new-business-survey`, require('./newBusinessSurveyDestroy').default);
    app.get(`/tenant/:tenantId/new-business-survey/autocomplete`, require('./newBusinessSurveyAutocomplete').default);
    app.get(`/tenant/:tenantId/new-business-survey`, require('./newBusinessSurveyList').default);
    app.get(`/tenant/:tenantId/new-business-survey/:id`, require('./newBusinessSurveyFind').default);
};
//# sourceMappingURL=index.js.map