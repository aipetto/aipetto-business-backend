import {OAuth2Client} from "google-auth-library";
import AuthService from "../services/auth/authService";
import {splitFullName} from "./stringHelper";
import {databaseInit} from "../database/databaseConnection";

const CLIENT_ID = '78452845368-7qjrm95540uvjnlpcfa3vkpr4vldgrte.apps.googleusercontent.com';
const oAuth2Client = new OAuth2Client(CLIENT_ID);

export const validateGoogleIdToken = async ( token) => {
    // Create client id in API Credentials for Apple Iphone
    try{
        const ticket = await oAuth2Client.verifyIdToken({
           idToken: token,
           audience: [
               CLIENT_ID,
               '78452845368-0fih14v8f9coehbrl4k9qtdllmcm798c.apps.googleusercontent.com',
               '78452845368-1lsq8ckua8p55oqsob4k1v68mqaiqc5l.apps.googleusercontent.com'
           ],
        });

        const payload = ticket.getPayload();

        return databaseInit()
            .then((database) => {
                if (payload) {
                const {firstName, lastName} = splitFullName(
                    payload['name'],
                );

                return AuthService.signinFromSocial(
                    'google',
                    '',
                    payload['email'],
                    payload['email_verified'],
                    firstName,
                    lastName,
                    { database }
                );
              }
            })
            .catch((error) => {
                console.error(error);
            });
    }catch (error) {
        return null;
    }
}