import ApiResponseHandler from '../apiResponseHandler';
import ProductCategoryService from '../../services/productCategoryService';

export default async (req, res, next) => {
  try {

    const payload = await new ProductCategoryService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
