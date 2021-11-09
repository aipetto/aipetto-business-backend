import ApiResponseHandler from '../apiResponseHandler';
import BusinessServicesPricesService from '../../services/businessServicesPricesService';

export default async (req, res, next) => {
  try {
    const payload = await new BusinessServicesPricesService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
