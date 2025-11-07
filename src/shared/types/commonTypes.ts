import { ResponseSuccessService, ResponseErrorService } from '../services/ServiceResponse';

export interface ISetState<T = boolean> {
  (value: T): void;
}

export type ServiceResult<T> = ResponseSuccessService<T> | ResponseErrorService;
