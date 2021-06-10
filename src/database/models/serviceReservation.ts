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
      serviceProviderIDs: [{
        type: Schema.Types.ObjectId,
        ref: 'providers',
      }],
      time: {
        type: String,
        required: true,
        enum: [
          "06_00AM",
          "06_30AM",
          "07_00AM",
          "07_30AM",
          "08_00AM",
          "08_30AM",
          "09_00AM",
          "09_30AM",
          "10_00AM",
          "10_30AM",
          "11_00AM",
          "11_30AM",
          "12_00AM",
          "12_30PM",
          "01_30PM",
          "02_00PM",
          "02_30PM",
          "03_00PM",
          "03_30PM",
          "04_00PM",
          "04_30PM",
          "05_00PM",
          "05_30PM",
          "06_00PM",
          "06_30PM",
          "07_00PM",
          "07_30PM",
          "08_00PM",
          "09_30PM",
          "10_00PM",
          "10_30PM",
          "11_00PM",
          "11_30PM",
          "00_00AM",
          "00_30AM",
          "01_00AM",
          "01_30AM",
          "02_00AM",
          "02_30AM",
          "03_00AM",
          "03_30AM",
          "04_00AM",
          "04_30AM",
          "05_00",
          "05_30AM"
        ],
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
      totalPrice: {
        type: Number,
      },
      totalPriceWithDiscount: {
        type: Number,
      },
      discountCode: {
        type: Schema.Types.ObjectId,
        ref: 'discounts',
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
