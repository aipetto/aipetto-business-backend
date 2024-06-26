import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('messages');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const MessagesSchema = new Schema(
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      to: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
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

  MessagesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  MessagesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  MessagesSchema.set('toJSON', {
    getters: true,
  });

  MessagesSchema.set('toObject', {
    getters: true,
  });

  return database.model('messages', MessagesSchema);
};
