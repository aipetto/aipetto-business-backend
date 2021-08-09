import ApiResponseHandler from '../apiResponseHandler';
import CityService from '../../services/cityService';

export default async (req, res, next) => {
  try {

    const payload = await new CityService(
      req,
    ).findAllAutocomplete(req.query.query, req.query.limit);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
