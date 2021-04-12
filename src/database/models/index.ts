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
  require('./reservationAgenda').default,
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
