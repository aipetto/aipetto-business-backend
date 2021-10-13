import ApiResponseHandler from '../apiResponseHandler';
import PlaceTypeService from '../../services/placeTypeService';

export default async (req, res, next) => {
  try {
    const payload = await new PlaceTypeService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
