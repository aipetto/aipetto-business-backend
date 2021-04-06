import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('pet');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PetSchema = new Schema(
    {
      name: {
        type: String,
      },
      nickname: {
        type: String,
      },
      birthdate: {
        type: String,
      },
      age: {
        type: Number,
      },
      color: {
        type: String,
        enum: [
          "black",
          "white",
          "brown",
          "black_white",
          "brown_white",
          "gray",
          null
        ],
      },
      profileImage: [FileSchema],
      sex: {
        type: String,
        enum: [
          "male",
          "female",
          null
        ],
      },
      breed: {
        type: Schema.Types.ObjectId,
        ref: 'breed',
      },
      type: {
        type: Schema.Types.ObjectId,
        ref: 'petTypes',
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

  PetSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PetSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PetSchema.set('toJSON', {
    getters: true,
  });

  PetSchema.set('toObject', {
    getters: true,
  });

  return database.model('pet', PetSchema);
};
