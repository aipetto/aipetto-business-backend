import ApiResponseHandler from '../apiResponseHandler';
import LanguagesService from '../../services/languagesService';

export default async (req, res, next) => {
  try {
    const payload = await new LanguagesService(
      req,
    ).findAllAutocomplete(req.query.query, req.query.limit);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
