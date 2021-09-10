"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('landingSurvey');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const LandingSurveySchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        numberOfPets: {
            type: String,
        },
        interests: [{
                type: String
            }],
        extraInfo: {
            type: String,
        },
        allowReceiveNotifications: {
            type: Boolean,
            default: false
        },
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
        petProfession: [{
                type: String
            }],
        address: {
            type: String,
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
    LandingSurveySchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    LandingSurveySchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    LandingSurveySchema.set('toJSON', {
        getters: true,
    });
    LandingSurveySchema.set('toObject', {
        getters: true,
    });
    return database.model('landingSurvey', LandingSurveySchema);
};
//# sourceMappingURL=landingSurvey.js.map