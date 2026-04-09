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
    getWorkflowById: builder.query<any, {id: string}>({
      query: ({id}) => ({
        url: `${API_ENDPOINTS.WORKFLOWS}/${id}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getItems: builder.query<
      any,
      {
        workflowId: string;
        statusId?: string;
        statusKey?: string;
        assignedToId?: string;
        search?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: params => ({
        url: 'items',
        method: HTTP_METHOD.GET,
        params,
      }),
    }),
  }),
});

export const {
  useGetWorkflowsQuery,
  useGetWorkflowByIdQuery,
  useGetItemsQuery,
} = workflow;
