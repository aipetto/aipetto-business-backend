import ApiResponseHandler from '../apiResponseHandler';
import BreedService from '../../services/breedService';

export default async (req, res, next) => {
  try {
    const payload = await new BreedService(req).update(
      req.params.id,
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
