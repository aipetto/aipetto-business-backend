import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('country');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CountrySchema = new Schema(
    {
      name: {
        type: String,
      },
      initials: {
        type: String,
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

  CountrySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  CountrySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CountrySchema.set('toJSON', {
    getters: true,
  });

  CountrySchema.set('toObject', {
    getters: true,
  });

  return database.model('country', CountrySchema);
};
