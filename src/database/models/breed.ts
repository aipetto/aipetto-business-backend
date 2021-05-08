import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('breed');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const BreedSchema = new Schema(
    {
      name: {
        type: String,
      },
      language: {
        type: Schema.Types.ObjectId,
        ref: 'languages',
      },
      type: {
        type: Schema.Types.ObjectId,
        ref: 'petTypes',
      },
      size: {
        type: String,
        enum: [
          "Small",
          "Medium",
          "Large",
          null
        ],
      },
      exercise: {
        type: String,
        enum: [
          "up_to_30_minutes_per_day",
          "up_to_1_hour_per_day",
          "more_than_2_hours_per_day",
          null
        ],
      },
      sizeOfHome: {
        type: String,
        enum: [
          "flat_apartment",
          "small_house",
          "large_house",
          null
        ],
      },
      grooming: {
        type: String,
        enum: [
          "more_than_once_a_week",
          "every_day",
          "once_a_week",
          null
        ],
      },
      coatLength: {
        type: String,
        enum: [
          "short",
          "medium",
          "long",
          null
        ],
      },
      sheds: {
        type: String,
        enum: [
          "yes",
          "no",
          null
        ],
      },
      lifespan: {
        type: String,
        enum: [
          "under_10_years",
          "over_10_years",
          "over_12_years",
          null
        ],
      },
      vulnerableNativeBreed: {
        type: String,
        enum: [
          "yes",
          "no",
          null
        ],
      },
      townOrCountry: {
        type: String,
        enum: [
          "country",
          "town",
          "either",
          null
        ],
      },
      sizeOfGarden: {
        type: String,
        enum: [
          "small",
          "medium",
          "small_medium",
          "large",
          null
        ],
      },
      image: [FileSchema],
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

  BreedSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  BreedSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  BreedSchema.set('toJSON', {
    getters: true,
  });

  BreedSchema.set('toObject', {
    getters: true,
  });

  return database.model('breed', BreedSchema);
};
