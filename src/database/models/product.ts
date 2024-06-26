import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('product');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ProductSchema = new Schema(
    {
      sku: {
        type: String,
      },
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
      },
      description: {
        type: String,
        maxlength: 21845,
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0.01,
        max: 99999,
      },
      photos: [FileSchema],
      businessId: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      acceptPointsToShop: {
        type: Boolean,
        default: false
      },
      pointsPrice: {
        type: Number,
      },
      currency: {
        type: Schema.Types.ObjectId,
        ref: 'currency',
      },
      language: {
        type: Schema.Types.ObjectId,
        ref: 'languages',
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'country',
      },
      barcode: {
        type: Number,
        max: 13,
      },
      productNCM: {
        type: Number,
        max: 6,
      },
      inStock: {
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

  ProductSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ProductSchema.index(
    { sku: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        sku: { $type: 'string' },
      },
    },
  );

  ProductSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ProductSchema.set('toJSON', {
    getters: true,
  });

  ProductSchema.set('toObject', {
    getters: true,
  });

  return database.model('product', ProductSchema);
};
