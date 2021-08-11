import ApiResponseHandler from '../apiResponseHandler';
import CurrencyService from '../../services/currencyService';

export default async (req, res, next) => {
  try {
    const payload = await new CurrencyService(req).findById(
      req.params.id,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
