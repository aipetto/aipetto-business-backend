import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('businessServicesTypes');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const BusinessServicesTypesSchema = new Schema(
    {
      name: {
        type: String,
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: 'businessCategory',
      },
      language: {
        type: Schema.Types.ObjectId,
        ref: 'languages',
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

  BusinessServicesTypesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  BusinessServicesTypesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  BusinessServicesTypesSchema.set('toJSON', {
    getters: true,
  });

  BusinessServicesTypesSchema.set('toObject', {
    getters: true,
  });

  return database.model('businessServicesTypes', BusinessServicesTypesSchema);
};
