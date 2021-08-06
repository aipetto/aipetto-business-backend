export default (app) => {
  app.post(
    `/tenant/:tenantId/place-type`,
    require('./placeTypeCreate').default,
  );
  app.put(
    `/tenant/:tenantId/place-type/:id`,
    require('./placeTypeUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/place-type/import`,
    require('./placeTypeImport').default,
  );
  app.delete(
    `/tenant/:tenantId/place-type`,
    require('./placeTypeDestroy').default,
  );
  app.get(
    `/tenant/place-type/autocomplete`,
    require('./placeTypeAutocomplete').default,
  );
  app.get(
    `/tenant/place-type`,
    require('./placeTypeList').default,
  );
  app.get(
    `/tenant/place-type/:id`,
    require('./placeTypeFind').default,
  );
};
