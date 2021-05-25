import ApiResponseHandler from '../apiResponseHandler';
import LandingSurveyService from '../../services/landingSurveyService';

export default async (req, res, next) => {
  try {

    const payload = await new LandingSurveyService(req).create(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
