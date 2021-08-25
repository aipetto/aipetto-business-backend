import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('providers');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ProvidersSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      businessID: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      providerID: {
        type: String,
        required: true,
      },
      category: [{
        type: Schema.Types.ObjectId,
        ref: 'businessCategory',
      }],
      serviceTypes: [{
        type: Schema.Types.ObjectId,
        ref: 'businessServicesTypes',
      }],
      contactName: {
        type: String,
      },
      contactPhone: {
        type: String,
      },
      contactWhatsApp: {
        type: String,
      },
      addressStreet: {
        type: String,
      },
      addressStreetNumber: {
        type: String,
      },
      addressPostCode: {
        type: String,
      },
      city: {
        type: Schema.Types.ObjectId,
        ref: 'city',
      },
      state: {
        type: Schema.Types.ObjectId,
        ref: 'state',
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'country',
      },
      email: {
        type: String,
      },
      location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
      },
      basePricePerService: {
        type: Number,
      },
      currency: {
        type: Schema.Types.ObjectId,
        ref: 'currency',
      },
      profileImage: [FileSchema],
      attachedDoc: [FileSchema],
      language: {
        type: Schema.Types.ObjectId,
        ref: 'languages',
      },
      isIndependent: {
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

  ProvidersSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ProvidersSchema.index(
    { providerID: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        providerID: { $type: 'string' },
      },
    },
  );

  ProvidersSchema.index({ location: '2dsphere' });

  ProvidersSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ProvidersSchema.set('toJSON', {
    getters: true,
  });

  ProvidersSchema.set('toObject', {
    getters: true,
  });

  return database.model('providers', ProvidersSchema);
};
