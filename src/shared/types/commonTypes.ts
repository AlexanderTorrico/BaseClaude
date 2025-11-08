import { ServiceSuccessResponse, ServiceErrorResponse } from '../services/ServiceResponse';

export type SetStateFn<T = boolean> = (value: T) => void;

export type ServiceResult<T> = ServiceSuccessResponse<T> | ServiceErrorResponse;
