import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('customer');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CustomerSchema = new Schema(
    {
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      source: {
        type: String,
        enum: [
          "aipetto",
          "facebook",
          "twitter",
          "instagram",
          "youtube",
          "telegram",
          "whatsapp",
          "email",
          "phone",
          "direct",
          "friend_recomendation",
          null
        ],
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
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
      phoneNumber: {
        type: String,
      },
      address: {
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
        type: String,
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
