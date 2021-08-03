export default (app) => {
  app.post(
    `/tenant/:tenantId/pet-diseases`,
    require('./petDiseasesCreate').default,
  );
  app.put(
    `/tenant/:tenantId/pet-diseases/:id`,
    require('./petDiseasesUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/pet-diseases/import`,
    require('./petDiseasesImport').default,
  );
  app.delete(
    `/tenant/:tenantId/pet-diseases`,
    require('./petDiseasesDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/pet-diseases/autocomplete`,
    require('./petDiseasesAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/pet-diseases`,
    require('./petDiseasesList').default,
  );
  app.get(
    `/tenant/:tenantId/pet-diseases/:id`,
    require('./petDiseasesFind').default,
  );
};