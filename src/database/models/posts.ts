import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('posts');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PostsSchema = new Schema(
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      postHeaderImage: [FileSchema],
      postDocRelated: [FileSchema],
      postUrl: {
        type: String,
      },
      authors: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
      }],
      postCategory: [{
        type: Schema.Types.ObjectId,
        ref: 'postCategories',
      }],
      comments: [{
        type: Schema.Types.ObjectId,
        ref: 'postComments',
      }],
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

  PostsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PostsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PostsSchema.set('toJSON', {
    getters: true,
  });

  PostsSchema.set('toObject', {
    getters: true,
  });

  return database.model('posts', PostsSchema);
};
