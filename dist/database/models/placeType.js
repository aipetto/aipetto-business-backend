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
        return database.model('placeType');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PlaceTypeSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: 'languages',
        },
        placeTypeImage: [fileSchema_1.default],
        isPublicPlace: {
            type: Boolean,
            default: false
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
    PlaceTypeSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PlaceTypeSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    PlaceTypeSchema.set('toJSON', {
        getters: true,
    });
    PlaceTypeSchema.set('toObject', {
        getters: true,
    });
    return database.model('placeType', PlaceTypeSchema);
};
//# sourceMappingURL=placeType.js.map