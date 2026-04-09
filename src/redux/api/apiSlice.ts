import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/api/baseQuery';
import { API_ENDPOINTS, HTTP_METHOD } from '../../utils/constants/api';

export const workflow = createApi({
  reducerPath: 'workflow',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Workflows'],
  endpoints: builder => ({
    getWorkflows: builder.query<any, any>({
      query: () => ({
        url: API_ENDPOINTS.WORKFLOWS,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const { useGetWorkflowsQuery } = workflow;
