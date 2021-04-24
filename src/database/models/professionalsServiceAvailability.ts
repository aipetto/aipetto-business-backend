import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('professionalsServiceAvailability');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ProfessionalsServiceAvailabilitySchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      serviceType: {
        type: Schema.Types.ObjectId,
        ref: 'businessServicesTypes',
      },
      timeSlot: [{
        type: String  
      }],
      dateAvailabilityStart: {
        type: String,
      },
      dateAvailabilityEnd: {
        type: String,
      },
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

  ProfessionalsServiceAvailabilitySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  ProfessionalsServiceAvailabilitySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ProfessionalsServiceAvailabilitySchema.set('toJSON', {
    getters: true,
  });

  ProfessionalsServiceAvailabilitySchema.set('toObject', {
    getters: true,
  });

  return database.model('professionalsServiceAvailability', ProfessionalsServiceAvailabilitySchema);
};
