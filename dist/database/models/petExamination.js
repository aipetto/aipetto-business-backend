"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema_1 = __importDefault(require("./schemas/fileSchema"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('petExamination');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PetExaminationSchema = new Schema({
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
        examinationsFiles: [fileSchema_1.default],
        examinationImages: [fileSchema_1.default],
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
    }, { timestamps: true });
    PetExaminationSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
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
//# sourceMappingURL=petExamination.js.map