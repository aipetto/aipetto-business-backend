import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('petExamination');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PetExaminationSchema = new Schema(
    {
      petID: {
        type: Schema.Types.ObjectId,
        ref: 'pet',
      },
      examinationInternalCode: {
        type: String,
        required: true,
      },
      veterinariesResponsibleDiagnostic: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      }],
      businessID: {
        type: Schema.Types.ObjectId,
        ref: 'business',
      },
      language: {
        type: Schema.Types.ObjectId,
        ref: 'languages',
      },
      providersID: [{
        type: Schema.Types.ObjectId,
        ref: 'providers',
      }],
      statusExamination: {
        type: String,
        enum: [
          "open",
          "in_progress",
          "closed",
          "canceled",
          null
        ],
      },
      examinationsFiles: [FileSchema],
      examinationImages: [FileSchema],
      examinationDiagnosticNotes: {
        type: String,
      },
      examinationRecommendationNotes: {
        type: String,
      },
      nextExaminationSession: {
        type: Date,
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

  PetExaminationSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PetExaminationSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PetExaminationSchema.set('toJSON', {
    getters: true,
  });

  PetExaminationSchema.set('toObject', {
    getters: true,
  });

  return database.model('petExamination', PetExaminationSchema);
};
