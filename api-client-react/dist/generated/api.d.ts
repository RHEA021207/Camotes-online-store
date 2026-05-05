import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ActivityItem, Admin, AdminSession, ChangePasswordBody, CreateAdminBody, CreateCustomerBody, CreateOrderBody, CreateServiceBody, Customer, CustomerTimeline, CustomerWithStats, DailyReport, DashboardSummary, ErrorResponse, GetDailyReportParams, GetLowStockParams, HealthStatus, ListCustomersParams, ListOrdersParams, ListServicesParams, LoginBody, OkResponse, Order, OrderWithPayments, Payment, PaymentCalculatorBody, PaymentCalculatorResult, PortalLookupParams, RecordPaymentBody, Service, TopServiceItem, UpdateCustomerBody, UpdateOrderBody, UpdateServiceBody } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Admin login with username + password
 */
export declare const getAdminLoginUrl: () => string;
export declare const adminLogin: (loginBody: LoginBody, options?: RequestInit) => Promise<AdminSession>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<LoginBody>;
export type AdminLoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Admin login with username + password
 */
export declare const useAdminLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
/**
 * @summary Log out current admin
 */
export declare const getAdminLogoutUrl: () => string;
export declare const adminLogout: (options?: RequestInit) => Promise<OkResponse>;
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
 * @summary Log out current admin
 */
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
/**
 * @summary Get current admin session (or null)
 */
export declare const getAdminMeUrl: () => string;
export declare const adminMe: (options?: RequestInit) => Promise<AdminSession>;
export declare const getAdminMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof adminMe>>>;
export type AdminMeQueryError = ErrorType<unknown>;
/**
 * @summary Get current admin session (or null)
 */
export declare function useAdminMe<TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Change current admin's password
 */
export declare const getAdminChangePasswordUrl: () => string;
export declare const adminChangePassword: (changePasswordBody: ChangePasswordBody, options?: RequestInit) => Promise<OkResponse>;
export declare const getAdminChangePasswordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminChangePassword>>, TError, {
        data: BodyType<ChangePasswordBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminChangePassword>>, TError, {
    data: BodyType<ChangePasswordBody>;
}, TContext>;
export type AdminChangePasswordMutationResult = NonNullable<Awaited<ReturnType<typeof adminChangePassword>>>;
export type AdminChangePasswordMutationBody = BodyType<ChangePasswordBody>;
export type AdminChangePasswordMutationError = ErrorType<unknown>;
/**
 * @summary Change current admin's password
 */
export declare const useAdminChangePassword: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminChangePassword>>, TError, {
        data: BodyType<ChangePasswordBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminChangePassword>>, TError, {
    data: BodyType<ChangePasswordBody>;
}, TContext>;
/**
 * @summary List all admin accounts
 */
export declare const getListAdminsUrl: () => string;
export declare const listAdmins: (options?: RequestInit) => Promise<Admin[]>;
export declare const getListAdminsQueryKey: () => readonly ["/api/auth/admins"];
export declare const getListAdminsQueryOptions: <TData = Awaited<ReturnType<typeof listAdmins>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdmins>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdmins>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdmins>>>;
export type ListAdminsQueryError = ErrorType<unknown>;
/**
 * @summary List all admin accounts
 */
export declare function useListAdmins<TData = Awaited<ReturnType<typeof listAdmins>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdmins>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a new admin account
 */
export declare const getCreateAdminUrl: () => string;
export declare const createAdmin: (createAdminBody: CreateAdminBody, options?: RequestInit) => Promise<Admin>;
export declare const getCreateAdminMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdmin>>, TError, {
        data: BodyType<CreateAdminBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAdmin>>, TError, {
    data: BodyType<CreateAdminBody>;
}, TContext>;
export type CreateAdminMutationResult = NonNullable<Awaited<ReturnType<typeof createAdmin>>>;
export type CreateAdminMutationBody = BodyType<CreateAdminBody>;
export type CreateAdminMutationError = ErrorType<unknown>;
/**
 * @summary Add a new admin account
 */
export declare const useCreateAdmin: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdmin>>, TError, {
        data: BodyType<CreateAdminBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAdmin>>, TError, {
    data: BodyType<CreateAdminBody>;
}, TContext>;
/**
 * @summary List all services (public)
 */
export declare const getListServicesUrl: (params?: ListServicesParams) => string;
export declare const listServices: (params?: ListServicesParams, options?: RequestInit) => Promise<Service[]>;
export declare const getListServicesQueryKey: (params?: ListServicesParams) => readonly ["/api/services", ...ListServicesParams[]];
export declare const getListServicesQueryOptions: <TData = Awaited<ReturnType<typeof listServices>>, TError = ErrorType<unknown>>(params?: ListServicesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListServicesQueryResult = NonNullable<Awaited<ReturnType<typeof listServices>>>;
export type ListServicesQueryError = ErrorType<unknown>;
/**
 * @summary List all services (public)
 */
export declare function useListServices<TData = Awaited<ReturnType<typeof listServices>>, TError = ErrorType<unknown>>(params?: ListServicesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a service (admin)
 */
export declare const getCreateServiceUrl: () => string;
export declare const createService: (createServiceBody: CreateServiceBody, options?: RequestInit) => Promise<Service>;
export declare const getCreateServiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createService>>, TError, {
        data: BodyType<CreateServiceBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createService>>, TError, {
    data: BodyType<CreateServiceBody>;
}, TContext>;
export type CreateServiceMutationResult = NonNullable<Awaited<ReturnType<typeof createService>>>;
export type CreateServiceMutationBody = BodyType<CreateServiceBody>;
export type CreateServiceMutationError = ErrorType<unknown>;
/**
 * @summary Create a service (admin)
 */
export declare const useCreateService: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createService>>, TError, {
        data: BodyType<CreateServiceBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createService>>, TError, {
    data: BodyType<CreateServiceBody>;
}, TContext>;
/**
 * @summary List trending services (public, wow endpoint)
 */
export declare const getListTrendingServicesUrl: () => string;
export declare const listTrendingServices: (options?: RequestInit) => Promise<Service[]>;
export declare const getListTrendingServicesQueryKey: () => readonly ["/api/services/trending"];
export declare const getListTrendingServicesQueryOptions: <TData = Awaited<ReturnType<typeof listTrendingServices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrendingServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTrendingServices>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTrendingServicesQueryResult = NonNullable<Awaited<ReturnType<typeof listTrendingServices>>>;
export type ListTrendingServicesQueryError = ErrorType<unknown>;
/**
 * @summary List trending services (public, wow endpoint)
 */
export declare function useListTrendingServices<TData = Awaited<ReturnType<typeof listTrendingServices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrendingServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a service
 */
export declare const getGetServiceUrl: (id: number) => string;
export declare const getService: (id: number, options?: RequestInit) => Promise<Service>;
export declare const getGetServiceQueryKey: (id: number) => readonly [`/api/services/${number}`];
export declare const getGetServiceQueryOptions: <TData = Awaited<ReturnType<typeof getService>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetServiceQueryResult = NonNullable<Awaited<ReturnType<typeof getService>>>;
export type GetServiceQueryError = ErrorType<unknown>;
/**
 * @summary Get a service
 */
export declare function useGetService<TData = Awaited<ReturnType<typeof getService>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a service (admin)
 */
export declare const getUpdateServiceUrl: (id: number) => string;
export declare const updateService: (id: number, updateServiceBody: UpdateServiceBody, options?: RequestInit) => Promise<Service>;
export declare const getUpdateServiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateService>>, TError, {
        id: number;
        data: BodyType<UpdateServiceBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateService>>, TError, {
    id: number;
    data: BodyType<UpdateServiceBody>;
}, TContext>;
export type UpdateServiceMutationResult = NonNullable<Awaited<ReturnType<typeof updateService>>>;
export type UpdateServiceMutationBody = BodyType<UpdateServiceBody>;
export type UpdateServiceMutationError = ErrorType<unknown>;
/**
 * @summary Update a service (admin)
 */
export declare const useUpdateService: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateService>>, TError, {
        id: number;
        data: BodyType<UpdateServiceBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateService>>, TError, {
    id: number;
    data: BodyType<UpdateServiceBody>;
}, TContext>;
/**
 * @summary Delete a service (admin)
 */
export declare const getDeleteServiceUrl: (id: number) => string;
export declare const deleteService: (id: number, options?: RequestInit) => Promise<OkResponse>;
export declare const getDeleteServiceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteService>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteService>>, TError, {
    id: number;
}, TContext>;
export type DeleteServiceMutationResult = NonNullable<Awaited<ReturnType<typeof deleteService>>>;
export type DeleteServiceMutationError = ErrorType<unknown>;
/**
 * @summary Delete a service (admin)
 */
export declare const useDeleteService: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteService>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteService>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List & search customers (admin)
 */
export declare const getListCustomersUrl: (params?: ListCustomersParams) => string;
export declare const listCustomers: (params?: ListCustomersParams, options?: RequestInit) => Promise<CustomerWithStats[]>;
export declare const getListCustomersQueryKey: (params?: ListCustomersParams) => readonly ["/api/customers", ...ListCustomersParams[]];
export declare const getListCustomersQueryOptions: <TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(params?: ListCustomersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCustomersQueryResult = NonNullable<Awaited<ReturnType<typeof listCustomers>>>;
export type ListCustomersQueryError = ErrorType<unknown>;
/**
 * @summary List & search customers (admin)
 */
export declare function useListCustomers<TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(params?: ListCustomersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a new customer (admin)
 */
export declare const getCreateCustomerUrl: () => string;
export declare const createCustomer: (createCustomerBody: CreateCustomerBody, options?: RequestInit) => Promise<Customer>;
export declare const getCreateCustomerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError, {
        data: BodyType<CreateCustomerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError, {
    data: BodyType<CreateCustomerBody>;
}, TContext>;
export type CreateCustomerMutationResult = NonNullable<Awaited<ReturnType<typeof createCustomer>>>;
export type CreateCustomerMutationBody = BodyType<CreateCustomerBody>;
export type CreateCustomerMutationError = ErrorType<unknown>;
/**
 * @summary Add a new customer (admin)
 */
export declare const useCreateCustomer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError, {
        data: BodyType<CreateCustomerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCustomer>>, TError, {
    data: BodyType<CreateCustomerBody>;
}, TContext>;
/**
 * @summary Get a customer (admin)
 */
export declare const getGetCustomerUrl: (id: number) => string;
export declare const getCustomer: (id: number, options?: RequestInit) => Promise<CustomerWithStats>;
export declare const getGetCustomerQueryKey: (id: number) => readonly [`/api/customers/${number}`];
export declare const getGetCustomerQueryOptions: <TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCustomerQueryResult = NonNullable<Awaited<ReturnType<typeof getCustomer>>>;
export type GetCustomerQueryError = ErrorType<unknown>;
/**
 * @summary Get a customer (admin)
 */
export declare function useGetCustomer<TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a customer (admin)
 */
export declare const getUpdateCustomerUrl: (id: number) => string;
export declare const updateCustomer: (id: number, updateCustomerBody: UpdateCustomerBody, options?: RequestInit) => Promise<Customer>;
export declare const getUpdateCustomerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError, {
        id: number;
        data: BodyType<UpdateCustomerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError, {
    id: number;
    data: BodyType<UpdateCustomerBody>;
}, TContext>;
export type UpdateCustomerMutationResult = NonNullable<Awaited<ReturnType<typeof updateCustomer>>>;
export type UpdateCustomerMutationBody = BodyType<UpdateCustomerBody>;
export type UpdateCustomerMutationError = ErrorType<unknown>;
/**
 * @summary Update a customer (admin)
 */
export declare const useUpdateCustomer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError, {
        id: number;
        data: BodyType<UpdateCustomerBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCustomer>>, TError, {
    id: number;
    data: BodyType<UpdateCustomerBody>;
}, TContext>;
/**
 * @summary Get a customer's full timeline (orders + payments)
 */
export declare const getGetCustomerTimelineUrl: (id: number) => string;
export declare const getCustomerTimeline: (id: number, options?: RequestInit) => Promise<CustomerTimeline>;
export declare const getGetCustomerTimelineQueryKey: (id: number) => readonly [`/api/customers/${number}/timeline`];
export declare const getGetCustomerTimelineQueryOptions: <TData = Awaited<ReturnType<typeof getCustomerTimeline>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCustomerTimeline>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCustomerTimeline>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCustomerTimelineQueryResult = NonNullable<Awaited<ReturnType<typeof getCustomerTimeline>>>;
export type GetCustomerTimelineQueryError = ErrorType<unknown>;
/**
 * @summary Get a customer's full timeline (orders + payments)
 */
export declare function useGetCustomerTimeline<TData = Awaited<ReturnType<typeof getCustomerTimeline>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCustomerTimeline>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Customer self-lookup by name and/or phone
 */
export declare const getPortalLookupUrl: (params?: PortalLookupParams) => string;
export declare const portalLookup: (params?: PortalLookupParams, options?: RequestInit) => Promise<CustomerWithStats[]>;
export declare const getPortalLookupQueryKey: (params?: PortalLookupParams) => readonly ["/api/portal/lookup", ...PortalLookupParams[]];
export declare const getPortalLookupQueryOptions: <TData = Awaited<ReturnType<typeof portalLookup>>, TError = ErrorType<unknown>>(params?: PortalLookupParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof portalLookup>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof portalLookup>>, TError, TData> & {
    queryKey: QueryKey;
};
export type PortalLookupQueryResult = NonNullable<Awaited<ReturnType<typeof portalLookup>>>;
export type PortalLookupQueryError = ErrorType<unknown>;
/**
 * @summary Customer self-lookup by name and/or phone
 */
export declare function usePortalLookup<TData = Awaited<ReturnType<typeof portalLookup>>, TError = ErrorType<unknown>>(params?: PortalLookupParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof portalLookup>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List orders (admin)
 */
export declare const getListOrdersUrl: (params?: ListOrdersParams) => string;
export declare const listOrders: (params?: ListOrdersParams, options?: RequestInit) => Promise<Order[]>;
export declare const getListOrdersQueryKey: (params?: ListOrdersParams) => readonly ["/api/orders", ...ListOrdersParams[]];
export declare const getListOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(params?: ListOrdersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listOrders>>>;
export type ListOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List orders (admin)
 */
export declare function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(params?: ListOrdersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create an order/loan for a customer (admin)
 */
export declare const getCreateOrderUrl: () => string;
export declare const createOrder: (createOrderBody: CreateOrderBody, options?: RequestInit) => Promise<Order>;
export declare const getCreateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<CreateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<CreateOrderBody>;
}, TContext>;
export type CreateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof createOrder>>>;
export type CreateOrderMutationBody = BodyType<CreateOrderBody>;
export type CreateOrderMutationError = ErrorType<unknown>;
/**
 * @summary Create an order/loan for a customer (admin)
 */
export declare const useCreateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<CreateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<CreateOrderBody>;
}, TContext>;
/**
 * @summary Get an order with payments
 */
export declare const getGetOrderUrl: (id: number) => string;
export declare const getOrder: (id: number, options?: RequestInit) => Promise<OrderWithPayments>;
export declare const getGetOrderQueryKey: (id: number) => readonly [`/api/orders/${number}`];
export declare const getGetOrderQueryOptions: <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
export type GetOrderQueryError = ErrorType<unknown>;
/**
 * @summary Get an order with payments
 */
export declare function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update an order (status, due date, notes) (admin)
 */
export declare const getUpdateOrderUrl: (id: number) => string;
export declare const updateOrder: (id: number, updateOrderBody: UpdateOrderBody, options?: RequestInit) => Promise<Order>;
export declare const getUpdateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
        id: number;
        data: BodyType<UpdateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
    id: number;
    data: BodyType<UpdateOrderBody>;
}, TContext>;
export type UpdateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof updateOrder>>>;
export type UpdateOrderMutationBody = BodyType<UpdateOrderBody>;
export type UpdateOrderMutationError = ErrorType<unknown>;
/**
 * @summary Update an order (status, due date, notes) (admin)
 */
export declare const useUpdateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
        id: number;
        data: BodyType<UpdateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOrder>>, TError, {
    id: number;
    data: BodyType<UpdateOrderBody>;
}, TContext>;
/**
 * @summary Record a payment for an order (admin)
 */
export declare const getRecordPaymentUrl: (id: number) => string;
export declare const recordPayment: (id: number, recordPaymentBody: RecordPaymentBody, options?: RequestInit) => Promise<Payment>;
export declare const getRecordPaymentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordPayment>>, TError, {
        id: number;
        data: BodyType<RecordPaymentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof recordPayment>>, TError, {
    id: number;
    data: BodyType<RecordPaymentBody>;
}, TContext>;
export type RecordPaymentMutationResult = NonNullable<Awaited<ReturnType<typeof recordPayment>>>;
export type RecordPaymentMutationBody = BodyType<RecordPaymentBody>;
export type RecordPaymentMutationError = ErrorType<unknown>;
/**
 * @summary Record a payment for an order (admin)
 */
export declare const useRecordPayment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordPayment>>, TError, {
        id: number;
        data: BodyType<RecordPaymentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof recordPayment>>, TError, {
    id: number;
    data: BodyType<RecordPaymentBody>;
}, TContext>;
/**
 * @summary High-level admin dashboard summary (wow endpoint)
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary High-level admin dashboard summary (wow endpoint)
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Recent payments and new orders (wow endpoint)
 */
export declare const getGetRecentActivityUrl: () => string;
export declare const getRecentActivity: (options?: RequestInit) => Promise<ActivityItem[]>;
export declare const getGetRecentActivityQueryKey: () => readonly ["/api/dashboard/recent-activity"];
export declare const getGetRecentActivityQueryOptions: <TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentActivity>>>;
export type GetRecentActivityQueryError = ErrorType<unknown>;
/**
 * @summary Recent payments and new orders (wow endpoint)
 */
export declare function useGetRecentActivity<TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Orders that are past their due date (wow endpoint)
 */
export declare const getGetOverdueOrdersUrl: () => string;
export declare const getOverdueOrders: (options?: RequestInit) => Promise<Order[]>;
export declare const getGetOverdueOrdersQueryKey: () => readonly ["/api/dashboard/overdue"];
export declare const getGetOverdueOrdersQueryOptions: <TData = Awaited<ReturnType<typeof getOverdueOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOverdueOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOverdueOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOverdueOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof getOverdueOrders>>>;
export type GetOverdueOrdersQueryError = ErrorType<unknown>;
/**
 * @summary Orders that are past their due date (wow endpoint)
 */
export declare function useGetOverdueOrders<TData = Awaited<ReturnType<typeof getOverdueOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOverdueOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Top selling services by order count (wow endpoint)
 */
export declare const getGetTopServicesUrl: () => string;
export declare const getTopServices: (options?: RequestInit) => Promise<TopServiceItem[]>;
export declare const getGetTopServicesQueryKey: () => readonly ["/api/dashboard/top-services"];
export declare const getGetTopServicesQueryOptions: <TData = Awaited<ReturnType<typeof getTopServices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTopServices>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTopServicesQueryResult = NonNullable<Awaited<ReturnType<typeof getTopServices>>>;
export type GetTopServicesQueryError = ErrorType<unknown>;
/**
 * @summary Top selling services by order count (wow endpoint)
 */
export declare function useGetTopServices<TData = Awaited<ReturnType<typeof getTopServices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Daily sales receipt summarizing today's payments
 */
export declare const getGetDailyReportUrl: (params?: GetDailyReportParams) => string;
export declare const getDailyReport: (params?: GetDailyReportParams, options?: RequestInit) => Promise<DailyReport>;
export declare const getGetDailyReportQueryKey: (params?: GetDailyReportParams) => readonly ["/api/dashboard/daily-report", ...GetDailyReportParams[]];
export declare const getGetDailyReportQueryOptions: <TData = Awaited<ReturnType<typeof getDailyReport>>, TError = ErrorType<unknown>>(params?: GetDailyReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDailyReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDailyReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDailyReportQueryResult = NonNullable<Awaited<ReturnType<typeof getDailyReport>>>;
export type GetDailyReportQueryError = ErrorType<unknown>;
/**
 * @summary Daily sales receipt summarizing today's payments
 */
export declare function useGetDailyReport<TData = Awaited<ReturnType<typeof getDailyReport>>, TError = ErrorType<unknown>>(params?: GetDailyReportParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDailyReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Orders due today (login alert)
 */
export declare const getGetDueTodayUrl: () => string;
export declare const getDueToday: (options?: RequestInit) => Promise<Order[]>;
export declare const getGetDueTodayQueryKey: () => readonly ["/api/dashboard/due-today"];
export declare const getGetDueTodayQueryOptions: <TData = Awaited<ReturnType<typeof getDueToday>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDueToday>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDueToday>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDueTodayQueryResult = NonNullable<Awaited<ReturnType<typeof getDueToday>>>;
export type GetDueTodayQueryError = ErrorType<unknown>;
/**
 * @summary Orders due today (login alert)
 */
export declare function useGetDueToday<TData = Awaited<ReturnType<typeof getDueToday>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDueToday>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Services with quantity below threshold
 */
export declare const getGetLowStockUrl: (params?: GetLowStockParams) => string;
export declare const getLowStock: (params?: GetLowStockParams, options?: RequestInit) => Promise<Service[]>;
export declare const getGetLowStockQueryKey: (params?: GetLowStockParams) => readonly ["/api/dashboard/low-stock", ...GetLowStockParams[]];
export declare const getGetLowStockQueryOptions: <TData = Awaited<ReturnType<typeof getLowStock>>, TError = ErrorType<unknown>>(params?: GetLowStockParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLowStock>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLowStock>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLowStockQueryResult = NonNullable<Awaited<ReturnType<typeof getLowStock>>>;
export type GetLowStockQueryError = ErrorType<unknown>;
/**
 * @summary Services with quantity below threshold
 */
export declare function useGetLowStock<TData = Awaited<ReturnType<typeof getLowStock>>, TError = ErrorType<unknown>>(params?: GetLowStockParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLowStock>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Compute monthly installment breakdown using simple interest
 */
export declare const getCalculatePaymentUrl: () => string;
export declare const calculatePayment: (paymentCalculatorBody: PaymentCalculatorBody, options?: RequestInit) => Promise<PaymentCalculatorResult>;
export declare const getCalculatePaymentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calculatePayment>>, TError, {
        data: BodyType<PaymentCalculatorBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof calculatePayment>>, TError, {
    data: BodyType<PaymentCalculatorBody>;
}, TContext>;
export type CalculatePaymentMutationResult = NonNullable<Awaited<ReturnType<typeof calculatePayment>>>;
export type CalculatePaymentMutationBody = BodyType<PaymentCalculatorBody>;
export type CalculatePaymentMutationError = ErrorType<unknown>;
/**
 * @summary Compute monthly installment breakdown using simple interest
 */
export declare const useCalculatePayment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof calculatePayment>>, TError, {
        data: BodyType<PaymentCalculatorBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof calculatePayment>>, TError, {
    data: BodyType<PaymentCalculatorBody>;
}, TContext>;
/**
 * @summary Lookup a customer by COS-### code (admin)
 */
export declare const getGetCustomerByCodeUrl: (code: string) => string;
export declare const getCustomerByCode: (code: string, options?: RequestInit) => Promise<CustomerWithStats>;
export declare const getGetCustomerByCodeQueryKey: (code: string) => readonly [`/api/customers/by-code/${string}`];
export declare const getGetCustomerByCodeQueryOptions: <TData = Awaited<ReturnType<typeof getCustomerByCode>>, TError = ErrorType<ErrorResponse>>(code: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCustomerByCode>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCustomerByCode>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCustomerByCodeQueryResult = NonNullable<Awaited<ReturnType<typeof getCustomerByCode>>>;
export type GetCustomerByCodeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Lookup a customer by COS-### code (admin)
 */
export declare function useGetCustomerByCode<TData = Awaited<ReturnType<typeof getCustomerByCode>>, TError = ErrorType<ErrorResponse>>(code: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCustomerByCode>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map