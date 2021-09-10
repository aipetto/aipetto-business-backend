"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('city');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const CitySchema = new Schema({
        country: {
            type: Schema.Types.ObjectId,
            ref: 'country',
        },
        name: {
            type: String,
        },
        latitude: {
            type: Number,
        },
        longitude: {
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
    CitySchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    CitySchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    CitySchema.set('toJSON', {
        getters: true,
    });
    CitySchema.set('toObject', {
        getters: true,
    });
    return database.model('city', CitySchema);
};
//# sourceMappingURL=city.js.map