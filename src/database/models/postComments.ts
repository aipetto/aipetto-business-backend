import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('postComments');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PostCommentsSchema = new Schema(
    {
      comment: {
        type: String,
        required: true,
      },
      postId: {
        type: Schema.Types.ObjectId,
        ref: 'posts',
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

  PostCommentsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PostCommentsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PostCommentsSchema.set('toJSON', {
    getters: true,
  });

  PostCommentsSchema.set('toObject', {
    getters: true,
  });

  return database.model('postComments', PostCommentsSchema);
};
