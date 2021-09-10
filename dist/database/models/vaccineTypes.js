"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('vaccineTypes');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const VaccineTypesSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'country',
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
        frequencyShotDosis: {
            type: String,
            enum: [
                "one_time",
                "every_month",
                "every_six_months",
                "every_year",
                null
            ],
        },
        petSpecificType: [{
                type: Schema.Types.ObjectId,
                ref: 'petTypes',
            }],
        vaccineCustomUniqueID: {
            type: String,
        },
        isMandatory: {
            type: Boolean,
            default: false
        },
        specificBreeds: [{
                type: Schema.Types.ObjectId,
                ref: 'breed',
            }],
        vaccinePetTargetAgeInMonths: {
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
    }, { timestamps: true });
    VaccineTypesSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    VaccineTypesSchema.index({ vaccineCustomUniqueID: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            vaccineCustomUniqueID: { $type: 'string' },
        },
    });
    VaccineTypesSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    VaccineTypesSchema.set('toJSON', {
        getters: true,
    });
    VaccineTypesSchema.set('toObject', {
        getters: true,
    });
    return database.model('vaccineTypes', VaccineTypesSchema);
};
//# sourceMappingURL=vaccineTypes.js.map