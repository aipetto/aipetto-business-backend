"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('place');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PlaceSchema = new Schema({
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'business',
        },
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
        address: {
            type: String,
        },
        addressNumber: {
            type: String,
        },
        addressZipCode: {
            type: String,
        },
        openTime: {
            type: String,
        },
        closeTime: {
            type: String,
        },
        is24hours: {
            type: Boolean,
            default: false
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
    }, { timestamps: true });
    PlaceSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PlaceSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    PlaceSchema.set('toJSON', {
        getters: true,
    });
    PlaceSchema.set('toObject', {
        getters: true,
    });
    return database.model('place', PlaceSchema);
};
//# sourceMappingURL=place.js.map