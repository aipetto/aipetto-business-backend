import ApiResponseHandler from '../apiResponseHandler';
import VaccineTypesService from '../../services/vaccineTypesService';

export default async (req, res, next) => {
  try {
    const payload = await new VaccineTypesService(req).create(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
