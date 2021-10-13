import ApiResponseHandler from '../apiResponseHandler';
import PetTypesService from '../../services/petTypesService';

export default async (req, res, next) => {
  try {
    const payload = await new PetTypesService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
