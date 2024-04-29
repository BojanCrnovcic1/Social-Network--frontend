import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiConfig } from "../config/api.config";

const apiPhotoService = (
    path: string,
    method: 'get' | 'post' | 'patch' | 'delete',
    body: any | undefined,
): Promise<ApiResponse> => {
    return new Promise<ApiResponse>((resolve) => {
        const requestData: AxiosRequestConfig<any> = {
            method: method,
            baseURL: ApiConfig.API_URL,
            url: path,
            data: body,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        };

        console.log('Token before request:', getToken());

        axios(requestData)
            .then(res => {
                
                responseHandler(res, resolve);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    const response: ApiResponse = {
                        status: 'login',
                        data: null,
                    };
                    return resolve(response);
                }

                const response: ApiResponse = {
                    status: 'error',
                    data: error,
                };
                resolve(response);
            });
    });
};

export default apiPhotoService;

export interface ApiResponse {
    status: 'ok' | 'error' | 'login';
    data: any;
}

const responseHandler = async (
    res: AxiosResponse<any>,
    resolve: (value?: ApiResponse | any) => void
) => {
    if (res.status < 200 || res.status >= 300) {
        const response: ApiResponse = {
            status: 'error',
            data: res.data

        };
        return resolve(response);
    }

    let response: ApiResponse;

    if (res.data.statusCode < 0) {
        response = {
            status: 'login',
            data: null
        };

        console.log('Received login response:', response);
    } else {
        response = {
            status: 'ok',
            data: res.data,
        };
    }

    resolve(response);
};

export const getToken = (): string => {
    const token = localStorage.getItem('api_token');
    return token || '';
};

export const saveToken = (token: string) => {
    localStorage.setItem('api_token', token);
};