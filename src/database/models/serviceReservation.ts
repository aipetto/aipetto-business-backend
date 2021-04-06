import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('serviceReservation');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ServiceReservationSchema = new Schema(
    {
      date: {
        type: String,
      },
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      customerId: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
      },
      serviceType: [{
        type: Schema.Types.ObjectId,
        ref: 'businessServicesTypes',
      }],
      time: {
        type: String,
      },
      needTransportation: {
        type: Boolean,
        default: false
      },
      place: {
        type: Schema.Types.ObjectId,
        ref: 'place',
      },
      status: {
        type: String,
        enum: [
          "user_approval_pending",
          "business_approval_pending",
          "business_approved",
          "business_declined",
          null
        ],
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

  ServiceReservationSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  ServiceReservationSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ServiceReservationSchema.set('toJSON', {
    getters: true,
  });

  ServiceReservationSchema.set('toObject', {
    getters: true,
  });

  return database.model('serviceReservation', ServiceReservationSchema);
};
