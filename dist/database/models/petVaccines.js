"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('petVaccines');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PetVaccinesSchema = new Schema({
        name: {
            type: Schema.Types.ObjectId,
            ref: 'vaccineTypes',
        },
        uniqueVetVaccineCode: {
            type: String,
        },
        datetimeTaken: {
            type: Date,
        },
        veterinarianID: {
            type: Schema.Types.ObjectId,
            ref: 'providers',
        },
        placeTaken: {
            type: Schema.Types.ObjectId,
            ref: 'place',
        },
        businessID: {
            type: Schema.Types.ObjectId,
            ref: 'business',
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
    }, { timestamps: true });
    PetVaccinesSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PetVaccinesSchema.index({ uniqueVetVaccineCode: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            uniqueVetVaccineCode: { $type: 'string' },
        },
    });
    PetVaccinesSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    PetVaccinesSchema.set('toJSON', {
        getters: true,
    });
    PetVaccinesSchema.set('toObject', {
        getters: true,
    });
    return database.model('petVaccines', PetVaccinesSchema);
};
//# sourceMappingURL=petVaccines.js.map