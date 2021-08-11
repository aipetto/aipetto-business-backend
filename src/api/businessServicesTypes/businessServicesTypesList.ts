import ApiResponseHandler from '../apiResponseHandler';
import BusinessServicesTypesService from '../../services/businessServicesTypesService';

export default async (req, res, next) => {
  try {
    const payload = await new BusinessServicesTypesService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
