import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('place');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PlaceSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      placeType: {
        type: Schema.Types.ObjectId,
        ref: 'placeType',
        required: true,
      },
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
        required: true,
      },
      services: [{
        type: Schema.Types.ObjectId,
        ref: 'businessServicesTypes',
        required: true,
      }],
      categories: [{
        type: Schema.Types.ObjectId,
        ref: 'businessCategory',
        required: true,
      }],
      location: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false
        }
      },
      address: {
        type: String,
        required: true,
      },
      addressNumber: {
        type: String,
        required: true,
      },
      addressZipCode: {
        type: String,
      },
      addressCity: {
        type: String,
        required: true,
      },
      addressState: {
        type: String,
        required: true,
      },
      addressCountry: {
        type: Schema.Types.ObjectId,
        ref: 'country',
        required: true,
      },
      openTime: {
        type: String,
      },
      closeTime: {
        type: String,
      },
      is24hours: {
        type: Boolean,
        default: false
      },
      stars: {
        type: Number,
      },
      isOpen: {
        type: Boolean,
        default: false
      },
      photoLogo: [FileSchema],
      photoStore: [FileSchema],
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

  PlaceSchema.index(
    { importHash: 1, tenant: 1},
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  PlaceSchema.index({ location: '2dsphere' });

  PlaceSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PlaceSchema.set('toJSON', {
    getters: true,
  });

  PlaceSchema.set('toObject', {
    getters: true,
  });

  return database.model('place', PlaceSchema);
};
