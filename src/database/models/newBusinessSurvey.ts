import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('newBusinessSurvey');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const NewBusinessSurveySchema = new Schema(
    {
      nameBusiness: {
        type: String,
        required: true,
      },
      numberOfPlaces: {
        type: String,
      },
      contactName: {
        type: String,
      },
      contactEmail: {
        type: String,
      },
      contactPhone: {
        type: String,
      },
      cellphoneForSMS: {
        type: String,
      },
      digitalNetworks: {
        type: String,
      },
      allowReceiveNotifications: {
        type: Boolean,
        default: false
      },
      services: [{
        type: String  
      }],
      address: {
        type: String,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
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

  NewBusinessSurveySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  NewBusinessSurveySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  NewBusinessSurveySchema.set('toJSON', {
    getters: true,
  });

  NewBusinessSurveySchema.set('toObject', {
    getters: true,
  });

  return database.model('newBusinessSurvey', NewBusinessSurveySchema);
};
