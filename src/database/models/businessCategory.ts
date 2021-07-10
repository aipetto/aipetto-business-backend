import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('businessCategory');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const BusinessCategorySchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      language: {
        type: Schema.Types.ObjectId,
        ref: 'languages',
      },
      categoryImage: [FileSchema],
      pageUrl: {
        type: String,
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

  BusinessCategorySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  BusinessCategorySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  BusinessCategorySchema.set('toJSON', {
    getters: true,
  });

  BusinessCategorySchema.set('toObject', {
    getters: true,
  });

  return database.model('businessCategory', BusinessCategorySchema);
};
