import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('businessPlaceServiceAvailability');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const BusinessPlaceServiceAvailabilitySchema = new Schema(
    {
      name: {
        type: String,
      },
      places: [{
        type: Schema.Types.ObjectId,
        ref: 'place',
      }],
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      dateStart: {
        type: String,
        required: true,
      },
      dateEnd: {
        type: String,
        required: true,
      },
      timeSlot: [{
        type: String  
      }],
      serviceType: {
        type: Schema.Types.ObjectId,
        ref: 'businessServicesTypes',
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

  BusinessPlaceServiceAvailabilitySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  BusinessPlaceServiceAvailabilitySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  BusinessPlaceServiceAvailabilitySchema.set('toJSON', {
    getters: true,
  });

  BusinessPlaceServiceAvailabilitySchema.set('toObject', {
    getters: true,
  });

  return database.model('businessPlaceServiceAvailability', BusinessPlaceServiceAvailabilitySchema);
};
