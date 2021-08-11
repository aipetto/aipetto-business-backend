import ApiResponseHandler from '../apiResponseHandler';
import CountryService from '../../services/countryService';

export default async (req, res, next) => {
  try {

    const payload = await new CountryService(
      req,
    ).findAllAutocomplete(req.query.query, req.query.limit);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
