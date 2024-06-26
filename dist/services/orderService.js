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
const Error400_1 = __importDefault(require("../errors/Error400"));
const mongooseRepository_1 = __importDefault(require("../database/repositories/mongooseRepository"));
const orderRepository_1 = __importDefault(require("../database/repositories/orderRepository"));
const customerRepository_1 = __importDefault(require("../database/repositories/customerRepository"));
const productRepository_1 = __importDefault(require("../database/repositories/productRepository"));
const businessRepository_1 = __importDefault(require("../database/repositories/businessRepository"));
const userRepository_1 = __importDefault(require("../database/repositories/userRepository"));
class OrderService {
    constructor(options) {
        this.options = options;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                data.customer = yield customerRepository_1.default.filterIdInTenant(data.customer, Object.assign(Object.assign({}, this.options), { session }));
                data.products = yield productRepository_1.default.filterIdsInTenant(data.products, Object.assign(Object.assign({}, this.options), { session }));
                data.employee = yield userRepository_1.default.filterIdInTenant(data.employee, Object.assign(Object.assign({}, this.options), { session }));
                data.businessId = yield businessRepository_1.default.filterIdInTenant(data.businessId, Object.assign(Object.assign({}, this.options), { session }));
                const record = yield orderRepository_1.default.create(data, Object.assign(Object.assign({}, this.options), { session }));
                yield mongooseRepository_1.default.commitTransaction(session);
                return record;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                mongooseRepository_1.default.handleUniqueFieldError(error, this.options.language, 'order');
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                data.customer = yield customerRepository_1.default.filterIdInTenant(data.customer, Object.assign(Object.assign({}, this.options), { session }));
                data.products = yield productRepository_1.default.filterIdsInTenant(data.products, Object.assign(Object.assign({}, this.options), { session }));
                data.employee = yield userRepository_1.default.filterIdInTenant(data.employee, Object.assign(Object.assign({}, this.options), { session }));
                data.businessId = yield businessRepository_1.default.filterIdInTenant(data.businessId, Object.assign(Object.assign({}, this.options), { session }));
                const record = yield orderRepository_1.default.update(id, data, Object.assign(Object.assign({}, this.options), { session }));
                yield mongooseRepository_1.default.commitTransaction(session);
                return record;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                mongooseRepository_1.default.handleUniqueFieldError(error, this.options.language, 'order');
                throw error;
            }
        });
    }
    destroyAll(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                for (const id of ids) {
                    yield orderRepository_1.default.destroy(id, Object.assign(Object.assign({}, this.options), { session }));
                }
                yield mongooseRepository_1.default.commitTransaction(session);
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return orderRepository_1.default.findById(id, this.options);
        });
    }
    findAllAutocomplete(search, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return orderRepository_1.default.findAllAutocomplete(search, limit, this.options);
        });
    }
    findAndCountAll(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return orderRepository_1.default.findAndCountAll(args, this.options);
        });
    }
    import(data, importHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!importHash) {
                throw new Error400_1.default(this.options.language, 'importer.errors.importHashRequired');
            }
            if (yield this._isImportHashExistent(importHash)) {
                throw new Error400_1.default(this.options.language, 'importer.errors.importHashExistent');
            }
            const dataToCreate = Object.assign(Object.assign({}, data), { importHash });
            return this.create(dataToCreate);
        });
    }
    _isImportHashExistent(importHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield orderRepository_1.default.count({
                importHash,
            }, this.options);
            return count > 0;
        });
    }
}
exports.default = OrderService;
//# sourceMappingURL=orderService.js.map