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
const permissionChecker_1 = __importDefault(require("../../services/user/permissionChecker"));
const apiResponseHandler_1 = __importDefault(require("../apiResponseHandler"));
const permissions_1 = __importDefault(require("../../security/permissions"));
const petVaccinesService_1 = __importDefault(require("../../services/petVaccinesService"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        new permissionChecker_1.default(req).validateHas(permissions_1.default.values.petVaccinesEdit);
        const payload = yield new petVaccinesService_1.default(req).update(req.params.id, req.body.data);
        yield apiResponseHandler_1.default.success(req, res, payload);
    }
    catch (error) {
        yield apiResponseHandler_1.default.error(req, res, error);
    }
});
//# sourceMappingURL=petVaccinesUpdate.js.map