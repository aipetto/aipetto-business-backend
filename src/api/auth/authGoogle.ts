import {validateGoogleIdToken} from "../../helpers/googleVerifyToken";
import ApiResponseHandler from "../apiResponseHandler";

export default async (req, res) => {
    try{
        const token = req.body.token;

        if (!token) {
            const error = res.json({
                ok: false,
                msg: 'Token missing'
            });
            await ApiResponseHandler.error(req, res, error);
        }

        const jwt = await validateGoogleIdToken( token );

        if(!jwt){
            const payload = res.status(400).json({
                ok: false
            });
            await ApiResponseHandler.error(req, res, payload);
        }

        await ApiResponseHandler.success(req, res, jwt);
    } catch (error) {
        await ApiResponseHandler.error(req, res, error);
    }
};
