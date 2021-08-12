import ApiResponseHandler from '../apiResponseHandler';
import CountryService from '../../services/countryService';

export default async (req, res, next) => {
  try {

    const payload = await new CountryService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
