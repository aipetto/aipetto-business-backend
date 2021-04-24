import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('business');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const BusinessSchema = new Schema(
    {
      name: {
        type: String,
      },
      services: [{
        type: Schema.Types.ObjectId,
        ref: 'businessServicesTypes',
      }],
      contactName: {
        type: String,
      },
      contactPhone: {
        type: String,
      },
      contactWhatsApp: {
        type: String,
      },
      contactEmail: {
        type: String,
      },
      addressStreet: {
        type: String,
      },
      addressStreetNumber: {
        type: String,
      },
      addressPostCode: {
        type: String,
      },
      city: {
        type: Schema.Types.ObjectId,
        ref: 'city',
      },
      state: {
        type: Schema.Types.ObjectId,
        ref: 'state',
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'country',
      },
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      importHash: { type: String },
    },
    { timestamps: true },
  );

  BusinessSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  BusinessSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  BusinessSchema.set('toJSON', {
    getters: true,
  });

  BusinessSchema.set('toObject', {
    getters: true,
  });

  return database.model('business', BusinessSchema);
};
