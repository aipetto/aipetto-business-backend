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
        return database.model('deals');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const DealsSchema = new Schema({
        status: {
            type: String,
            enum: [
                "open",
                "in_progress",
                "closed",
                null
            ],
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'customer',
        },
        digitalContracts: [fileSchema_1.default],
        dateStart: {
            type: String,
        },
        dateEnded: {
            type: String,
        },
        salesManagerResponsible: {
            type: Schema.Types.ObjectId,
            ref: 'user',
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
    DealsSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    DealsSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    DealsSchema.set('toJSON', {
        getters: true,
    });
    DealsSchema.set('toObject', {
        getters: true,
    });
    return database.model('deals', DealsSchema);
};
//# sourceMappingURL=deals.js.map