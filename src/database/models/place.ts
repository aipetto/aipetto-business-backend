import mongoose from 'mongoose';
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
      },
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      address: {
        type: String,
      },
      addressNumber: {
        type: String,
      },
      addressZipCode: {
        type: String,
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
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

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
