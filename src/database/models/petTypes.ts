import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('petTypes');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PetTypesSchema = new Schema(
    {
      name: {
        type: String,
      },
      image: [FileSchema],
      breeds: [{
        type: Schema.Types.ObjectId,
        ref: 'breed',
      }],
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

  PetTypesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PetTypesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PetTypesSchema.set('toJSON', {
    getters: true,
  });

  PetTypesSchema.set('toObject', {
    getters: true,
  });

  return database.model('petTypes', PetTypesSchema);
};
