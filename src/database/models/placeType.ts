import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('placeType');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PlaceTypeSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
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

  PlaceTypeSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PlaceTypeSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PlaceTypeSchema.set('toJSON', {
    getters: true,
  });

  PlaceTypeSchema.set('toObject', {
    getters: true,
  });

  return database.model('placeType', PlaceTypeSchema);
};
