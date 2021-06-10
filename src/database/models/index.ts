const models = [
  require('./tenant').default,
  require('./auditLog').default,  
  require('./settings').default,
  require('./user').default,
  require('./customer').default,
  require('./product').default,
  require('./order').default,
  require('./pet').default,
  require('./breed').default,
  require('./petTypes').default,
  require('./business').default,
  require('./place').default,
  require('./businessServicesTypes').default,
  require('./serviceReservation').default,
  require('./businessPlaceServiceAvailability').default,
  require('./country').default,
  require('./city').default,
  require('./state').default,
  require('./messages').default,
  require('./professionalsServiceAvailability').default,
  require('./languages').default,
  require('./currency').default,
  require('./discounts').default,
  require('./wallet').default,
  require('./businessCategory').default,
  require('./providers').default,
  require('./vaccineTypes').default,
  require('./petVaccines').default,
  require('./placeType').default,
  require('./landingSurvey').default,
  require('./newBusinessSurvey').default,
];

export default function init(database) {
  for (let model of models) {
    model(database);
  }

  return database;
}

export async function createCollections(database) {
  for (let model of models) {
    await model(database).createCollection();
  }

  return database;
}
