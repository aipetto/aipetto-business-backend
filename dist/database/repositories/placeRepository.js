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
const place_1 = __importDefault(require("../models/place"));
const serviceReservation_1 = __importDefault(require("../models/serviceReservation"));
class PlaceRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield place_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id }),
            ], mongooseRepository_1.default.getSessionOptionsIfExists(options));
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(place_1.default(options.database).findById(id), options);
            if (!record ||
                String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield mongooseRepository_1.default.wrapWithSessionIfExists(place_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id })), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(place_1.default(options.database).findById(id), options);
            if (!record ||
                String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield mongooseRepository_1.default.wrapWithSessionIfExists(place_1.default(options.database).deleteOne({ _id: id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, serviceReservation_1.default(options.database), 'place', options);
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            return mongooseRepository_1.default.wrapWithSessionIfExists(place_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(place_1.default(options.database)
                .findById(id)
                .populate('businessId'), options);
            if (!record ||
                String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            return this._fillFileDownloadUrls(record);
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
                if (filter.businessId) {
                    criteriaAnd.push({
                        businessId: mongooseQueryUtils_1.default.uuid(filter.businessId),
                    });
                }
                if (filter.latitudeRange) {
                    const [start, end] = filter.latitudeRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            latitude: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            latitude: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.longitudeRange) {
                    const [start, end] = filter.longitudeRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            longitude: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            longitude: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.address) {
                    criteriaAnd.push({
                        address: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.address),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressNumber) {
                    criteriaAnd.push({
                        addressNumber: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressNumber),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressZipCode) {
                    criteriaAnd.push({
                        addressZipCode: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressZipCode),
                            $options: 'i',
                        },
                    });
                }
                if (filter.openTime) {
                    criteriaAnd.push({
                        openTime: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.openTime),
                            $options: 'i',
                        },
                    });
                }
                if (filter.closeTime) {
                    criteriaAnd.push({
                        closeTime: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.closeTime),
                            $options: 'i',
                        },
                    });
                }
                if (filter.is24hours === true ||
                    filter.is24hours === 'true' ||
                    filter.is24hours === false ||
                    filter.is24hours === 'false') {
                    criteriaAnd.push({
                        is24hours: filter.is24hours === true ||
                            filter.is24hours === 'true',
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
            let rows = yield place_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate('businessId');
            const count = yield place_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._fillFileDownloadUrls));
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
            const records = yield place_1.default(options.database)
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
                entityName: place_1.default(options.database).modelName,
                entityId: id,
                action,
                values: data,
            }, options);
        });
    }
    static _fillFileDownloadUrls(record) {
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
exports.default = PlaceRepository;
//# sourceMappingURL=placeRepository.js.map