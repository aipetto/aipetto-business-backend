"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('reservationAgenda');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const ReservationAgendaSchema = new Schema({
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'business',
        },
        timeSlot: [{
                type: String
            }],
        serviceType: {
            type: Schema.Types.ObjectId,
            ref: 'businessServicesTypes',
        },
        name: {
            type: String,
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
    ReservationAgendaSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    ReservationAgendaSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    ReservationAgendaSchema.set('toJSON', {
        getters: true,
    });
    ReservationAgendaSchema.set('toObject', {
        getters: true,
    });
    return database.model('reservationAgenda', ReservationAgendaSchema);
};
//# sourceMappingURL=reservationAgenda.js.map