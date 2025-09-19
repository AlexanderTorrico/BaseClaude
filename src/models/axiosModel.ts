import { AxiosResponse } from "axios";

export interface AxiosModel<T> {
    call: Promise<AxiosResponse<T>>,
    controller?: AbortController
}