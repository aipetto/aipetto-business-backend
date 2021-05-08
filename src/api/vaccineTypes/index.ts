export default (app) => {
  app.post(
    `/tenant/:tenantId/vaccine-types`,
    require('./vaccineTypesCreate').default,
  );
  app.put(
    `/tenant/:tenantId/vaccine-types/:id`,
    require('./vaccineTypesUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/vaccine-types/import`,
    require('./vaccineTypesImport').default,
  );
  app.delete(
    `/tenant/:tenantId/vaccine-types`,
    require('./vaccineTypesDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/vaccine-types/autocomplete`,
    require('./vaccineTypesAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/vaccine-types`,
    require('./vaccineTypesList').default,
  );
  app.get(
    `/tenant/:tenantId/vaccine-types/:id`,
    require('./vaccineTypesFind').default,
  );
};
