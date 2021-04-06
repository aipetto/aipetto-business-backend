import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('breed');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const BreedSchema = new Schema(
    {
      name: {
        type: String,
      },
      type: {
        type: Schema.Types.ObjectId,
        ref: 'petTypes',
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

  BreedSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  BreedSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  BreedSchema.set('toJSON', {
    getters: true,
  });

  BreedSchema.set('toObject', {
    getters: true,
  });

  return database.model('breed', BreedSchema);
};
