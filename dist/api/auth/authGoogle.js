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
const googleVerifyToken_1 = require("../../helpers/googleVerifyToken");
const apiResponseHandler_1 = __importDefault(require("../apiResponseHandler"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        if (!token) {
            const error = res.json({
                ok: false,
                msg: 'Token missing'
            });
            yield apiResponseHandler_1.default.error(req, res, error);
        }
        const jwt = yield googleVerifyToken_1.validateGoogleIdToken(token);
        if (!jwt) {
            const payload = res.status(400).json({
                ok: false
            });
            yield apiResponseHandler_1.default.error(req, res, payload);
        }
        yield apiResponseHandler_1.default.success(req, res, jwt);
    }
    catch (error) {
        yield apiResponseHandler_1.default.error(req, res, error);
    }
});
//# sourceMappingURL=authGoogle.js.map