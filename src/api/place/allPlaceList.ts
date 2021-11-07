import ApiResponseHandler from '../apiResponseHandler';
import PlaceService from '../../services/placeService';

export default async (req, res, next) => {
  try {
    const payload = await new PlaceService(
      req,
    ).findAllPlacesAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
