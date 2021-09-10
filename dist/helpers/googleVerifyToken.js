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
exports.validateGoogleIdToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const authService_1 = __importDefault(require("../services/auth/authService"));
const stringHelper_1 = require("./stringHelper");
const databaseConnection_1 = require("../database/databaseConnection");
const CLIENT_ID = '78452845368-7qjrm95540uvjnlpcfa3vkpr4vldgrte.apps.googleusercontent.com';
const oAuth2Client = new google_auth_library_1.OAuth2Client(CLIENT_ID);
exports.validateGoogleIdToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Create client id in API Credentials for Apple Iphone
    try {
        const ticket = yield oAuth2Client.verifyIdToken({
            idToken: token,
            audience: [
                CLIENT_ID,
                '78452845368-0fih14v8f9coehbrl4k9qtdllmcm798c.apps.googleusercontent.com',
                '78452845368-1lsq8ckua8p55oqsob4k1v68mqaiqc5l.apps.googleusercontent.com'
            ],
        });
        const payload = ticket.getPayload();
        return databaseConnection_1.databaseInit()
            .then((database) => {
            if (payload) {
                const { firstName, lastName } = stringHelper_1.splitFullName(payload['name']);
                const avatars = [{
                        name: "google_account_profile_image.jpg",
                        publicUrl: payload["picture"]
                    }];
                return authService_1.default.signinFromSocial('google', '', payload['email'], payload['email_verified'], firstName, lastName, avatars, { database });
            }
        })
            .catch((error) => {
            console.error(error);
        });
    }
    catch (error) {
        return null;
    }
});
//# sourceMappingURL=googleVerifyToken.js.map