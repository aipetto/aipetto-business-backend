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
const providers_1 = __importDefault(require("../models/providers"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
const serviceReservation_1 = __importDefault(require("../models/serviceReservation"));
const petVaccines_1 = __importDefault(require("../models/petVaccines"));
const petExamination_1 = __importDefault(require("../models/petExamination"));
class ProvidersRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield providers_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(providers_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield providers_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(providers_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield providers_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield mongooseRepository_1.default.destroyRelationToMany(id, serviceReservation_1.default(options.database), 'serviceProviderIDs', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, petVaccines_1.default(options.database), 'veterinarianID', options);
            yield mongooseRepository_1.default.destroyRelationToMany(id, petExamination_1.default(options.database), 'providersID', options);
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
            const records = yield providers_1.default(options.database)
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
            return mongooseRepository_1.default.wrapWithSessionIfExists(providers_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(providers_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id })
                .populate('businessID')
                .populate('category')
                .populate('serviceTypes')
                .populate('city')
                .populate('state')
                .populate('country')
                .populate('currency')
                .populate('language'), options);
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
                if (filter.name) {
                    criteriaAnd.push({
                        name: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.name),
                            $options: 'i',
                        },
                    });
                }
                if (filter.businessID) {
                    criteriaAnd.push({
                        businessID: mongooseQueryUtils_1.default.uuid(filter.businessID),
                    });
                }
                if (filter.providerID) {
                    criteriaAnd.push({
                        providerID: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.providerID),
                            $options: 'i',
                        },
                    });
                }
                if (filter.contactName) {
                    criteriaAnd.push({
                        contactName: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.contactName),
                            $options: 'i',
                        },
                    });
                }
                if (filter.contactPhone) {
                    criteriaAnd.push({
                        contactPhone: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.contactPhone),
                            $options: 'i',
                        },
                    });
                }
                if (filter.contactWhatsApp) {
                    criteriaAnd.push({
                        contactWhatsApp: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.contactWhatsApp),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressStreet) {
                    criteriaAnd.push({
                        addressStreet: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressStreet),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressStreetNumber) {
                    criteriaAnd.push({
                        addressStreetNumber: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressStreetNumber),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressPostCode) {
                    criteriaAnd.push({
                        addressPostCode: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressPostCode),
                            $options: 'i',
                        },
                    });
                }
                if (filter.city) {
                    criteriaAnd.push({
                        city: mongooseQueryUtils_1.default.uuid(filter.city),
                    });
                }
                if (filter.state) {
                    criteriaAnd.push({
                        state: mongooseQueryUtils_1.default.uuid(filter.state),
                    });
                }
                if (filter.country) {
                    criteriaAnd.push({
                        country: mongooseQueryUtils_1.default.uuid(filter.country),
                    });
                }
                if (filter.email) {
                    criteriaAnd.push({
                        email: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.email),
                            $options: 'i',
                        },
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
                if (filter.basePricePerServiceRange) {
                    const [start, end] = filter.basePricePerServiceRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            basePricePerService: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            basePricePerService: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.currency) {
                    criteriaAnd.push({
                        currency: mongooseQueryUtils_1.default.uuid(filter.currency),
                    });
                }
                if (filter.language) {
                    criteriaAnd.push({
                        language: mongooseQueryUtils_1.default.uuid(filter.language),
                    });
                }
                if (filter.isIndependent === true ||
                    filter.isIndependent === 'true' ||
                    filter.isIndependent === false ||
                    filter.isIndependent === 'false') {
                    criteriaAnd.push({
                        isIndependent: filter.isIndependent === true ||
                            filter.isIndependent === 'true',
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
            let rows = yield providers_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate('businessID')
                .populate('category')
                .populate('serviceTypes')
                .populate('city')
                .populate('state')
                .populate('country')
                .populate('currency')
                .populate('language');
            const count = yield providers_1.default(options.database).countDocuments(criteria);
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
                        {
                            name: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: 'i',
                            }
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort('name_ASC');
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield providers_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.name,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: providers_1.default(options.database).modelName,
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
            output.profileImage = yield fileRepository_1.default.fillDownloadUrl(output.profileImage);
            output.attachedDoc = yield fileRepository_1.default.fillDownloadUrl(output.attachedDoc);
            return output;
        });
    }
}
exports.default = ProvidersRepository;
//# sourceMappingURL=providersRepository.js.map