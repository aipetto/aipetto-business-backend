"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('petDiseases');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PetDiseasesSchema = new Schema({
        diseaseCommonName: {
            type: String,
        },
        diseaseScientificNames: {
            type: String,
        },
        isHumanContagious: {
            type: Boolean,
            default: false
        },
        isPetContagious: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            enum: [
                "en",
                "es",
                "pt",
                null
            ],
        },
        specificPetTypes: [{
                type: Schema.Types.ObjectId,
                ref: 'petTypes',
            }],
        specificPetBreeds: [{
                type: Schema.Types.ObjectId,
                ref: 'breed',
            }],
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
    PetDiseasesSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PetDiseasesSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    PetDiseasesSchema.set('toJSON', {
        getters: true,
    });
    PetDiseasesSchema.set('toObject', {
        getters: true,
    });
    return database.model('petDiseases', PetDiseasesSchema);
};
//# sourceMappingURL=petDiseases.js.map