import ApiResponseHandler from '../apiResponseHandler';
import BusinessCategoryService from '../../services/businessCategoryService';

export default async (req, res, next) => {
  try {
    const payload = await new BusinessCategoryService(
      req,
    ).findAllAutocomplete(req.query.query, req.query.limit);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
