import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/api/baseQuery';
import { API_ENDPOINTS, HTTP_METHOD } from '../../utils/constants/api';

export const workflow = createApi({
  reducerPath: 'workflow',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Workflows', 'Items'],
  endpoints: builder => ({
    getWorkflows: builder.query<any, any>({
      query: () => ({
        url: API_ENDPOINTS.WORKFLOWS,
        method: HTTP_METHOD.GET,
      }),
    }),
    getWorkflowById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
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
        url: API_ENDPOINTS.ITEMS,
        method: HTTP_METHOD.GET,
        params,
      }),
      providesTags: ['Items'],
    }),
    createItem: builder.mutation<
      any,
      {
        workflowId: string;
        statusId: string;
        assignedToId: string;
        data: any;
      }
    >({
      query: body => ({
        url: API_ENDPOINTS.ITEMS,
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: ['Items'],
    }),
    updateItem: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `${API_ENDPOINTS.ITEMS}/${id}`,
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: ['Items'],
    }),
    getUsers: builder.query<any, any>({
      query: () => ({
        url: API_ENDPOINTS.USERS,
        method: HTTP_METHOD.GET,
      }),
    }),
    getItemById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.ITEMS}/${id}`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ['Items'],
    }),
    deleteItem: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.ITEMS}/${id}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ['Items'],
    }),
  }),
});

export const {
  useGetWorkflowsQuery,
  useGetWorkflowByIdQuery,
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useGetUsersQuery,
  useGetItemByIdQuery,
  useDeleteItemMutation,
} = workflow;
