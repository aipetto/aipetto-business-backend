import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('pointsChallenges');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PointsChallengesSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'country',
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

  PointsChallengesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  PointsChallengesSchema.index(
    { name: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        name: { $type: 'string' },
      },
    },
  );  

  PointsChallengesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PointsChallengesSchema.set('toJSON', {
    getters: true,
  });

  PointsChallengesSchema.set('toObject', {
    getters: true,
  });

  return database.model('pointsChallenges', PointsChallengesSchema);
};
