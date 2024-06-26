import ApiResponseHandler from '../apiResponseHandler';
import PlaceService from '../../services/placeService';

export default async (req, res, next) => {
  try {
    const payload = await new PlaceService(req).findById(
      req.params.id,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
