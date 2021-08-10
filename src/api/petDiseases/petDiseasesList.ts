import ApiResponseHandler from '../apiResponseHandler';
import PetDiseasesService from '../../services/petDiseasesService';

export default async (req, res, next) => {
  try {

    const payload = await new PetDiseasesService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
