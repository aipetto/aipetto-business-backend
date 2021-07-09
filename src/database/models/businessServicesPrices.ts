import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('businessServicesPrices');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const BusinessServicesPricesSchema = new Schema(
    {
      service: {
        type: Schema.Types.ObjectId,
        ref: 'businessServicesTypes',
      },
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      servicePrice: {
        type: Number,
        required: true,
      },
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: true
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

  BusinessServicesPricesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  BusinessServicesPricesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  BusinessServicesPricesSchema.set('toJSON', {
    getters: true,
  });

  BusinessServicesPricesSchema.set('toObject', {
    getters: true,
  });

  return database.model('businessServicesPrices', BusinessServicesPricesSchema);
};
