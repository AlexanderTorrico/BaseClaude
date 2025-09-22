import { AxiosResponse } from "axios";

export interface AxiosCallModel<T> {
    call: Promise<AxiosResponse<T>>,
    controller?: AbortController
}