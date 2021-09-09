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
      profileImage: [FileSchema],
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
          "gray",
          "chocolate",
          "gold",
          "blue",
          "cream",
          "yellow",
          null
        ],
      },
      secondColor: {
        type: String,
        enum: [
          "black",
          "white",
          "brown",
          "gray",
          "chocolate",
          "gold",
          "blue",
          "cream",
          "yellow",
          null
        ],
      },
      thirdColor: {
        type: String,
        enum: [
          "black",
          "white",
          "brown",
          "gray",
          "chocolate",
          "gold",
          "blue",
          "cream",
          "yellow",
          null
        ],
      },
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
      secondBreedMixed: {
        type: Schema.Types.ObjectId,
        ref: 'breed',
      },
      type: {
        type: Schema.Types.ObjectId,
        ref: 'petTypes',
      },
      customerId: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
      },
      petOwners: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
      }],
      photos: [{
        type: Schema.Types.ObjectId,
        ref: 'petPhotos',
      }],
      vaccines: [{
        type: Schema.Types.ObjectId,
        ref: 'petVaccines',
      }],
      maturitySize: {
        type: String,
        enum: [
          "small",
          "medium",
          "large",
          "extra_large",
          "not_specified",
          null
        ],
      },
      furLength: {
        type: String,
        enum: [
          "short",
          "medium",
          "long",
          "not_specified",
          null
        ],
      },
      hasBeenVaccinated: {
        type: Boolean,
        default: false
      },
      hasBeenDewormed: {
        type: Boolean,
        default: false
      },
      hasBeenSterilizedSpayed: {
        type: Boolean,
        default: false
      },
      health: {
        type: String,
        enum: [
          "healthy",
          "minor_injury",
          "serious_injury",
          "not_specified",
          null
        ],
      },
      isLost: {
        type: Boolean,
        default: false
      },
      biography: {
        type: String,
      },
      usersAuthorized: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
      }],
      businessAuthorized: [{
        type: Schema.Types.ObjectId,
        ref: 'business',
      }],
      isLookingForMatch: {
        type: Boolean,
        default: false
      },
      diseases: [{
        type: Schema.Types.ObjectId,
        ref: 'petDiseases',
      }],
      isGuideDog: {
        type: Boolean,
        default: false
      },
      numberOfLikes: {
        type: Number,
      },
      matches: [{
        type: Schema.Types.ObjectId,
        ref: 'pet',
      }],
      petFriends: [{
        type: Schema.Types.ObjectId,
        ref: 'pet',
      }],
      governmentUniqueID: {
        type: String,
      },
      bloodType: {
        type: String,
        enum: [
          "canine_DEA_1_1",
          "canine_DEA_1_2",
          "canine_DEA_3",
          "canine_DEA_4",
          "canine_DEA_5",
          "canine_DEA_7",
          null
        ],
      },
      hasMicrochip: {
        type: Boolean,
        default: false
      },
      weight: {
        type: Number,
      },
      weightUnit: {
        type: String,
        enum: [
          "kilograms",
          "pounds",
          null
        ],
      },
      height: {
        type: Number,
      },
      heightUnit: {
        type: String,
        enum: [
          "meters",
          "feet",
          null
        ],
      },
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

  PetSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  PetSchema.index({ location: '2dsphere' });

  PetSchema.index(
    { governmentUniqueID: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        governmentUniqueID: { $type: 'string' },
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
