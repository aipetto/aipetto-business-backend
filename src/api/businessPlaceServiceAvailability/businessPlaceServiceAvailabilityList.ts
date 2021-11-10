import ApiResponseHandler from '../apiResponseHandler';
import BusinessPlaceServiceAvailabilityService from '../../services/businessPlaceServiceAvailabilityService';

export default async (req, res, next) => {
  try {
    const payload = await new BusinessPlaceServiceAvailabilityService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
