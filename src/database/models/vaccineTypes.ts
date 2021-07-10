import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('vaccineTypes');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const VaccineTypesSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'country',
      },
      language: {
        type: String,
        enum: [
          "en",
          "es",
          "pt",
          null
        ],
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

  VaccineTypesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  VaccineTypesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  VaccineTypesSchema.set('toJSON', {
    getters: true,
  });

  VaccineTypesSchema.set('toObject', {
    getters: true,
  });

  return database.model('vaccineTypes', VaccineTypesSchema);
};
