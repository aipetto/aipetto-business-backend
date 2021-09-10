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
        return database.model('business');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const BusinessSchema = new Schema({
        businessID: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        services: [{
                type: Schema.Types.ObjectId,
                ref: 'businessServicesTypes',
            }],
        categories: [{
                type: Schema.Types.ObjectId,
                ref: 'businessCategory',
            }],
        contactName: {
            type: String,
        },
        contactPhone: {
            type: String,
        },
        contactWhatsApp: {
            type: String,
        },
        contactEmail: {
            type: String,
        },
        addressStreet: {
            type: String,
        },
        addressStreetNumber: {
            type: String,
        },
        streetComplement: {
            type: String,
        },
        addressPostCode: {
            type: String,
        },
        city: {
            type: Schema.Types.ObjectId,
            ref: 'city',
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: 'state',
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'country',
        },
        businessLogo: [fileSchema_1.default],
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
        website: {
            type: String,
        },
        facebook: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        notes: {
            type: String,
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: 'languages',
        },
        currency: {
            type: Schema.Types.ObjectId,
            ref: 'currency',
        },
        instagram: {
            type: String,
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
    BusinessSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    BusinessSchema.index({ location: '2dsphere' });
    BusinessSchema.index({ businessID: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            businessID: { $type: 'string' },
        },
    });
    BusinessSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    BusinessSchema.set('toJSON', {
        getters: true,
    });
    BusinessSchema.set('toObject', {
        getters: true,
    });
    return database.model('business', BusinessSchema);
};
//# sourceMappingURL=business.js.map