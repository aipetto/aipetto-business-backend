import ApiResponseHandler from '../apiResponseHandler';
import ProductCategoryService from '../../services/productCategoryService';

export default async (req, res, next) => {
  try {
    const payload = await new ProductCategoryService(
      req,
    ).findAllAutocomplete(req.query.query, req.query.limit);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
