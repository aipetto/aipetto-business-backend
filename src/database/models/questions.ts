import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('questions');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const QuestionsSchema = new Schema(
    {
      question: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: [
          "dynamic_from_user",
          "static_system_faq",
          "static_system_pet_info",
          "static_system_pet_health",
          "static_system_pet_grooming",
          "static_system_pet_curiosities",
          null
        ],
      },
      userID: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      isActive: {
        type: Boolean,
        default: false
      },
      language: {
        type: Schema.Types.ObjectId,
        ref: 'languages',
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'country',
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

  QuestionsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  QuestionsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  QuestionsSchema.set('toJSON', {
    getters: true,
  });

  QuestionsSchema.set('toObject', {
    getters: true,
  });

  return database.model('questions', QuestionsSchema);
};
