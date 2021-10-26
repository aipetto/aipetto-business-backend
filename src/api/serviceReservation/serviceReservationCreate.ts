import ApiResponseHandler from '../apiResponseHandler';
import ServiceReservationService from '../../services/serviceReservationService';

export default async (req, res, next) => {
  try {
    const payload = await new ServiceReservationService(req).create(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
