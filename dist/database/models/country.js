"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('country');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const CountrySchema = new Schema({
        name: {
            type: String,
        },
        initials: {
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
    CountrySchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    CountrySchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    CountrySchema.set('toJSON', {
        getters: true,
    });
    CountrySchema.set('toObject', {
        getters: true,
    });
    return database.model('country', CountrySchema);
};
//# sourceMappingURL=country.js.map