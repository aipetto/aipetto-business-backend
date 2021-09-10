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
const petExaminationRepository_1 = __importDefault(require("../database/repositories/petExaminationRepository"));
const petRepository_1 = __importDefault(require("../database/repositories/petRepository"));
const businessRepository_1 = __importDefault(require("../database/repositories/businessRepository"));
const providersRepository_1 = __importDefault(require("../database/repositories/providersRepository"));
const userRepository_1 = __importDefault(require("../database/repositories/userRepository"));
class PetExaminationService {
    constructor(options) {
        this.options = options;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                data.petID = yield petRepository_1.default.filterIdInTenant(data.petID, Object.assign(Object.assign({}, this.options), { session }));
                data.veterinariesResponsibleDiagnostic = yield userRepository_1.default.filterIdsInTenant(data.veterinariesResponsibleDiagnostic, Object.assign(Object.assign({}, this.options), { session }));
                data.businessID = yield businessRepository_1.default.filterIdInTenant(data.businessID, Object.assign(Object.assign({}, this.options), { session }));
                data.providersID = yield providersRepository_1.default.filterIdsInTenant(data.providersID, Object.assign(Object.assign({}, this.options), { session }));
                const record = yield petExaminationRepository_1.default.create(data, Object.assign(Object.assign({}, this.options), { session }));
                yield mongooseRepository_1.default.commitTransaction(session);
                return record;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                mongooseRepository_1.default.handleUniqueFieldError(error, this.options.language, 'petExamination');
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                data.petID = yield petRepository_1.default.filterIdInTenant(data.petID, Object.assign(Object.assign({}, this.options), { session }));
                data.veterinariesResponsibleDiagnostic = yield userRepository_1.default.filterIdsInTenant(data.veterinariesResponsibleDiagnostic, Object.assign(Object.assign({}, this.options), { session }));
                data.businessID = yield businessRepository_1.default.filterIdInTenant(data.businessID, Object.assign(Object.assign({}, this.options), { session }));
                data.providersID = yield providersRepository_1.default.filterIdsInTenant(data.providersID, Object.assign(Object.assign({}, this.options), { session }));
                const record = yield petExaminationRepository_1.default.update(id, data, Object.assign(Object.assign({}, this.options), { session }));
                yield mongooseRepository_1.default.commitTransaction(session);
                return record;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                mongooseRepository_1.default.handleUniqueFieldError(error, this.options.language, 'petExamination');
                throw error;
            }
        });
    }
    destroyAll(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                for (const id of ids) {
                    yield petExaminationRepository_1.default.destroy(id, Object.assign(Object.assign({}, this.options), { session }));
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
            return petExaminationRepository_1.default.findById(id, this.options);
        });
    }
    findAllAutocomplete(search, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return petExaminationRepository_1.default.findAllAutocomplete(search, limit, this.options);
        });
    }
    findAndCountAll(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return petExaminationRepository_1.default.findAndCountAll(args, this.options);
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
            const count = yield petExaminationRepository_1.default.count({
                importHash,
            }, this.options);
            return count > 0;
        });
    }
}
exports.default = PetExaminationService;
//# sourceMappingURL=petExaminationService.js.map