import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/api/baseQuery';
import { API_ENDPOINTS, HTTP_METHOD } from '../../utils/constants/api';

export const workflow = createApi({
  reducerPath: 'workflow',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Workflows', 'Items', 'Users'],
  keepUnusedDataFor: 300, // Keep data in cache for 5 minutes
  endpoints: builder => ({
    getWorkflows: builder.query<any, any>({
      query: () => ({
        url: API_ENDPOINTS.WORKFLOWS,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ['Workflows'],
    }),
    getWorkflowById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.WORKFLOWS}/${id}`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ['Workflows'],
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
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        // Optimistic update for getItemById
        const patchResult = dispatch(
          workflow.util.updateQueryData('getItemById', { id }, draft => {
            if (draft?.data) {
              if (body.statusId) draft.data.statusId = body.statusId;
              if (body.assignedToId)
                draft.data.assignedToId = body.assignedToId;
              if (body.data) {
                draft.data.data = { ...draft.data.data, ...body.data };
              }
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getUsers: builder.query<any, any>({
      query: () => ({
        url: API_ENDPOINTS.USERS,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ['Users'],
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
