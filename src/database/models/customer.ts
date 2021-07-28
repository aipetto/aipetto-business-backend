import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('customer');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CustomerSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
      },
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      uniqueCustomIdentifier: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      source: {
        type: String,
        enum: [
          "facebook",
          "twitter",
          "linkedin",
          "phone_call",
          "aipetto",
          "instagram",
          "email",
          "reddit",
          "in_person",
          "recommended_by_friend",
          "website",
          "youtube",
          "google",
          "whatsapp",
          null
        ],
      },
      surname: {
        type: String,
      },
      birthdate: {
        type: String,
      },
      gender: {
        type: String,
        enum: [
          "male",
          "female",
          null
        ],
      },
      whatsApp: {
        type: String,
      },
      smsPhoneNumber: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      address: {
        type: String,
      },
      email: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'country',
      },
      billingAddressStreet: {
        type: String,
      },
      billingAddressCity: {
        type: String,
      },
      billingAddressState: {
        type: String,
      },
      billingAddressZipCode: {
        type: String,
      },
      billingAddressCountry: {
        type: String,
      },
      shippingAddressStreet: {
        type: String,
      },
      shippingAddressCity: {
        type: String,
      },
      shippingAddressState: {
        type: String,
      },
      shippingAddressZipCode: {
        type: String,
      },
      shippingAddressCountry: {
        type: String,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      prospectStatus: {
        type: String,
        enum: [
          "current_prospect",
          "lost_prospect",
          "non_prospect",
          null
        ],
      },
      customerStatus: {
        type: String,
        enum: [
          "current_customer",
          "past_customer",
          "non_customer",
          null
        ],
      },
      wantToReceiveNotifications: {
        type: Boolean,
        default: false
      },
      currency: {
        type: Schema.Types.ObjectId,
        ref: 'currency',
      },
      balance: {
        type: Number,
      },
      shippingAddressStreetNumber: {
        type: String,
      },
      addressStreetNumber: {
        type: String,
      },
      billingAddressStreetNumber: {
        type: String,
      },
      addressStreetComplement: {
        type: String,
      },
      billingAddressStreetComplement: {
        type: String,
      },
      shippingAddressStreetComplement: {
        type: String,
      },
      customerProfileImage: [FileSchema],
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

  CustomerSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  CustomerSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CustomerSchema.set('toJSON', {
    getters: true,
  });

  CustomerSchema.set('toObject', {
    getters: true,
  });

  return database.model('customer', CustomerSchema);
};
