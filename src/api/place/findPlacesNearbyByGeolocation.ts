import PlaceService from "../../services/placeService";
import ApiResponseHandler from "../apiResponseHandler";

export default async(req, res, next) => {
    try{
      const payload = await new PlaceService(
          req,
      ).findPlacesNearbyByGeolocation(req.query);
        await ApiResponseHandler.success(req, res, payload);
    } catch (error) {
        await ApiResponseHandler.error(req, res, error);
    }
}