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
        return database.model('place');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PlaceSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        placeType: {
            type: Schema.Types.ObjectId,
            ref: 'placeType',
        },
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'business',
        },
        services: [{
                type: Schema.Types.ObjectId,
                ref: 'businessServicesTypes',
            }],
        categories: [{
                type: Schema.Types.ObjectId,
                ref: 'businessCategory',
            }],
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
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
        addressCity: {
            type: String,
        },
        addressState: {
            type: String,
        },
        addressCountry: {
            type: Schema.Types.ObjectId,
            ref: 'country',
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
        stars: {
            type: Number,
        },
        isOpen: {
            type: Boolean,
            default: false
        },
        photoLogo: [fileSchema_1.default],
        photoStore: [fileSchema_1.default],
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
    PlaceSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PlaceSchema.index({ location: '2dsphere' });
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