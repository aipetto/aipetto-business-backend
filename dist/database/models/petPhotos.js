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
        return database.model('petPhotos');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PetPhotosSchema = new Schema({
        description: {
            type: String,
        },
        petId: {
            type: Schema.Types.ObjectId,
            ref: 'pet',
        },
        photo: [fileSchema_1.default],
        latitude: {
            type: String,
        },
        longitude: {
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
    PetPhotosSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PetPhotosSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    PetPhotosSchema.set('toJSON', {
        getters: true,
    });
    PetPhotosSchema.set('toObject', {
        getters: true,
    });
    return database.model('petPhotos', PetPhotosSchema);
};
//# sourceMappingURL=petPhotos.js.map