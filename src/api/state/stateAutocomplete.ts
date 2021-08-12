import ApiResponseHandler from '../apiResponseHandler';
import StateService from '../../services/stateService';

export default async (req, res, next) => {
  try {
    const payload = await new StateService(
      req,
    ).findAllAutocomplete(req.query.query, req.query.limit);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
