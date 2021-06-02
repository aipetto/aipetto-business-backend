import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('landingSurvey');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const LandingSurveySchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      numberOfPets: {
        type: String,
      },
      interests: [{
        type: String  
      }],
      extraInfo: {
        type: String,
      },
      allowReceiveNotifications: {
        type: Boolean,
        default: false
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

  LandingSurveySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  LandingSurveySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  LandingSurveySchema.set('toJSON', {
    getters: true,
  });

  LandingSurveySchema.set('toObject', {
    getters: true,
  });

  return database.model('landingSurvey', LandingSurveySchema);
};
