"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('answers');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const AnswersSchema = new Schema({
        answer: {
            type: String,
            required: true,
        },
        userID: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        type: {
            type: String,
            enum: [
                "dynamic_from_user",
                "static_system_faq",
                "static_system_pet_info",
                "static_system_pet_health",
                "static_system_pet_grooming",
                "static_system_pet_curiosities",
                null
            ],
        },
        isActive: {
            type: Boolean,
            default: false
        },
        questionID: [{
                type: Schema.Types.ObjectId,
                ref: 'questions',
            }],
        language: {
            type: Schema.Types.ObjectId,
            ref: 'languages',
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
    AnswersSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    AnswersSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    AnswersSchema.set('toJSON', {
        getters: true,
    });
    AnswersSchema.set('toObject', {
        getters: true,
    });
    return database.model('answers', AnswersSchema);
};
//# sourceMappingURL=answers.js.map