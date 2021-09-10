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
const country_1 = __importDefault(require("../models/country"));
const customer_1 = __importDefault(require("../models/customer"));
const product_1 = __importDefault(require("../models/product"));
const business_1 = __importDefault(require("../models/business"));
const place_1 = __importDefault(require("../models/place"));
const serviceReservation_1 = __importDefault(require("../models/serviceReservation"));
const city_1 = __importDefault(require("../models/city"));
const state_1 = __importDefault(require("../models/state"));
const providers_1 = __importDefault(require("../models/providers"));
const vaccineTypes_1 = __importDefault(require("../models/vaccineTypes"));
const petVaccines_1 = __importDefault(require("../models/petVaccines"));
const landingSurvey_1 = __importDefault(require("../models/landingSurvey"));
const posts_1 = __importDefault(require("../models/posts"));
const pointsChallenges_1 = __importDefault(require("../models/pointsChallenges"));
const deals_1 = __importDefault(require("../models/deals"));
const businessPaymentCycle_1 = __importDefault(require("../models/businessPaymentCycle"));
const questions_1 = __importDefault(require("../models/questions"));
const contacts_1 = __importDefault(require("../models/contacts"));
class CountryRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield country_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(country_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield country_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(country_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield country_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, customer_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, product_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, business_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, place_1.default(options.database), 'addressCountry', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, serviceReservation_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, city_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, state_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, providers_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, vaccineTypes_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, petVaccines_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, landingSurvey_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, posts_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, pointsChallenges_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, deals_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, businessPaymentCycle_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, questions_1.default(options.database), 'country', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, contacts_1.default(options.database), 'country', options);
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
            const records = yield country_1.default(options.database)
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
            return mongooseRepository_1.default.wrapWithSessionIfExists(country_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(country_1.default(options.database)
                .findOne({ _id: id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            return this._mapRelationshipsAndFillDownloadUrl(record);
        });
    }
    static findAndCountAll({ filter, limit = 0, offset = 0, orderBy = '' }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteriaAnd = [];
            criteriaAnd.push({});
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
                if (filter.initials) {
                    criteriaAnd.push({
                        initials: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.initials),
                            $options: 'i',
                        },
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
            let rows = yield country_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort);
            const count = yield country_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._mapRelationshipsAndFillDownloadUrl));
            return { rows, count };
        });
    }
    static findAllAutocomplete(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteriaAnd = [{}];
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
            const records = yield country_1.default(options.database)
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
                entityName: country_1.default(options.database).modelName,
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
exports.default = CountryRepository;
//# sourceMappingURL=countryRepository.js.map