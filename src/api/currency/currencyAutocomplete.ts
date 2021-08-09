import ApiResponseHandler from '../apiResponseHandler';
import CurrencyService from '../../services/currencyService';

export default async (req, res, next) => {
  try {

    const payload = await new CurrencyService(
      req,
    ).findAllAutocomplete(req.query.query, req.query.limit);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
