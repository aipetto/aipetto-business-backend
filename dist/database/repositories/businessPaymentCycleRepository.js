"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongooseRepository_1 = __importDefault(require("./mongooseRepository"));
const mongooseQueryUtils_1 = __importDefault(require("../utils/mongooseQueryUtils"));
const auditLogRepository_1 = __importDefault(require("./auditLogRepository"));
const Error404_1 = __importDefault(require("../../errors/Error404"));
const lodash_1 = __importDefault(require("lodash"));
const businessPaymentCycle_1 = __importDefault(require("../models/businessPaymentCycle"));
class BusinessPaymentCycleRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield businessPaymentCycle_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(businessPaymentCycle_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield businessPaymentCycle_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(businessPaymentCycle_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield businessPaymentCycle_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
        });
    }
    static filterIdInTenant(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return lodash_1.default.get(yield this.filterIdsInTenant([id], options), '[0]', null);
        });
    }
    static filterIdsInTenant(ids, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ids || !ids.length) {
                return [];
            }
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const records = yield businessPaymentCycle_1.default(options.database)
                .find({
                _id: { $in: ids },
                tenant: currentTenant.id,
            })
                .select(['_id']);
            return records.map((record) => record._id);
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            return mongooseRepository_1.default.wrapWithSessionIfExists(businessPaymentCycle_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(businessPaymentCycle_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id })
                .populate('businessID')
                .populate('businessServiceReservationsUsed')
                .populate('customerID')
                .populate('country')
                .populate('currency'), options);
            if (!record) {
                throw new Error404_1.default();
            }
            return this._mapRelationshipsAndFillDownloadUrl(record);
        });
    }
    static findAndCountAll({ filter, limit = 0, offset = 0, orderBy = '' }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [];
            criteriaAnd.push({
                tenant: currentTenant.id,
            });
            if (filter) {
                if (filter.id) {
                    criteriaAnd.push({
                        ['_id']: mongooseQueryUtils_1.default.uuid(filter.id),
                    });
                }
                if (filter.businessID) {
                    criteriaAnd.push({
                        businessID: mongooseQueryUtils_1.default.uuid(filter.businessID),
                    });
                }
                if (filter.cycleStartRange) {
                    const [start, end] = filter.cycleStartRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            cycleStart: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            cycleStart: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.cycleEndRange) {
                    const [start, end] = filter.cycleEndRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            cycleEnd: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            cycleEnd: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.statusPayment) {
                    criteriaAnd.push({
                        statusPayment: filter.statusPayment
                    });
                }
                if (filter.totalBusinessServiceReservationPeriodRange) {
                    const [start, end] = filter.totalBusinessServiceReservationPeriodRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            totalBusinessServiceReservationPeriod: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            totalBusinessServiceReservationPeriod: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.totalCommisionCalculatedRange) {
                    const [start, end] = filter.totalCommisionCalculatedRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            totalCommisionCalculated: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            totalCommisionCalculated: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.commisionRateUsedOnCalculationRange) {
                    const [start, end] = filter.commisionRateUsedOnCalculationRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            commisionRateUsedOnCalculation: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            commisionRateUsedOnCalculation: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.statusCyclePayment) {
                    criteriaAnd.push({
                        statusCyclePayment: filter.statusCyclePayment
                    });
                }
                if (filter.customerID) {
                    criteriaAnd.push({
                        customerID: mongooseQueryUtils_1.default.uuid(filter.customerID),
                    });
                }
                if (filter.paymentMethod) {
                    criteriaAnd.push({
                        paymentMethod: filter.paymentMethod
                    });
                }
                if (filter.paymentGatewayReferenceCode) {
                    criteriaAnd.push({
                        paymentGatewayReferenceCode: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.paymentGatewayReferenceCode),
                            $options: 'i',
                        },
                    });
                }
                if (filter.paymentGatewayType) {
                    criteriaAnd.push({
                        paymentGatewayType: filter.paymentGatewayType
                    });
                }
                if (filter.country) {
                    criteriaAnd.push({
                        country: mongooseQueryUtils_1.default.uuid(filter.country),
                    });
                }
                if (filter.currency) {
                    criteriaAnd.push({
                        currency: mongooseQueryUtils_1.default.uuid(filter.currency),
                    });
                }
                if (filter.createdAtRange) {
                    const [start, end] = filter.createdAtRange;
                    if (start !== undefined &&
                        start !== null &&
                        start !== '') {
                        criteriaAnd.push({
                            ['createdAt']: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined &&
                        end !== null &&
                        end !== '') {
                        criteriaAnd.push({
                            ['createdAt']: {
                                $lte: end,
                            },
                        });
                    }
                }
            }
            const sort = mongooseQueryUtils_1.default.sort(orderBy || 'createdAt_DESC');
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = criteriaAnd.length
                ? { $and: criteriaAnd }
                : null;
            let rows = yield businessPaymentCycle_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate('businessID')
                .populate('businessServiceReservationsUsed')
                .populate('customerID')
                .populate('country')
                .populate('currency');
            const count = yield businessPaymentCycle_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._mapRelationshipsAndFillDownloadUrl));
            return { rows, count };
        });
    }
    static findAllAutocomplete(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [{
                    tenant: currentTenant.id,
                }];
            if (search) {
                criteriaAnd.push({
                    $or: [
                        {
                            _id: mongooseQueryUtils_1.default.uuid(search),
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort('id_ASC');
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield businessPaymentCycle_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.id,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: businessPaymentCycle_1.default(options.database).modelName,
                entityId: id,
                action,
                values: data,
            }, options);
        });
    }
    static _mapRelationshipsAndFillDownloadUrl(record) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!record) {
                return null;
            }
            const output = record.toObject
                ? record.toObject()
                : record;
            return output;
        });
    }
}
exports.default = BusinessPaymentCycleRepository;
//# sourceMappingURL=businessPaymentCycleRepository.js.map