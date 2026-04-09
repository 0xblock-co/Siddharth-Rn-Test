import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiError, axiosInstance } from './client';

import { persistor, resetStore } from '../../store';

export interface BaseQueryArgs {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  skipLoader?: boolean;
}

export const axiosBaseQuery: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  ApiError
> = async (args, api) => {
  const { dispatch, getState } = api;
  const { url, method, data, params, headers, skipLoader } = args;

  try {
    const result = await axiosInstance.request({
      url,
      method,
      data,
      params,
      headers: {
        ...headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    } as AxiosRequestConfig);

    return { data: result.data };
  } catch (rawError) {
    const error = rawError as AxiosError;
    console.log(error, 'errorerror', rawError);
    if (error.response?.status === 401) {
      console.log('401 Unauthorized error detected. Redirecting to login...');

      setTimeout(() => {
        resetStore();

        persistor.purge();
      }, 0);

      return {
        error: {
          status: 401,
          data: error.response?.data,
          message: 'Authentication failed. Please log in again.',
        } as ApiError,
      };
    }
    return {
      error: {
        status: error.response?.status || 500,
        data: error.response?.data,
        message: error.message,
      } as ApiError,
    };
  } finally {
  }
};
