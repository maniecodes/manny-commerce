// Admin routes
export const ADMIN_LOGIN = "/admin/auth/login";
export const IS_ADMIN_LOGIN = "/admin/auth/is-login";
export const ADMIN_PRODUCTS = "/admin/products";
export const ADMIN_PRODUCT = (id) => `/admin/products/${id}`;
export const ADMIN_ORDERS = "/admin/orders";
export const ADMIN_ORDER = (id) => `/admin/orders/${id}`;

// User routes
export const USER_SIGNUP = "/user/auth/signup";
export const USER_LOGIN = "/user/auth/login";
export const IS_USER_LOGIN = "/user/auth/is-login";
export const UPDATE_USER = "/user";
export const GET_USER = "/user";

// Product routes
export const CREATE_PRODUCT = "/products";
export const UPDATE_PRODUCT = (id) => `/products/${id}`;
export const DELETE_PRODUCT = (id) => `/products/${id}`;
export const GET_PRODUCT = (id) => `/products/${id}`;
export const GET_PRODUCTS = "/products";
export const GET_CATEGORY_PRODUCTS = (id) => `/products/category/${id}`;
export const CREATE_REVIEW = (id) => `/products/${id}/review`;

// Category routes
export const CREATE_CATEGORY = "/categories";
export const UPDATE_CATEGORY = (id) => `/categories/${id}`;
export const DELETE_CATEGORY = (id) => `/categories/${id}`;
export const GET_CATEGORY = (id) => `/categories/${id}`;
export const GET_CATEGORIES = "/categories";

// Cart routes
export const ADD_TO_CART = (id) => `/carts/${id}`;
export const DECREMENT_FROM_CART = (id) => `/carts/decrement/${id}`;
export const DELETE_FROM_CART = (id) => `/cart/${id}`;

// Order routes
export const CREATE_ORDER = "/orders";
export const UPDATE_ORDER = (id) => `/orders/${id}`;
export const DELETE_ORDER = (id) => `/orders/${id}`;
export const GET_ORDER = (id) => `/orders/${id}`;
export const GET_ORDERS = "/orders";

// Payment routes
export const CREATE_PAYMENT_INTENT = "/create-payment-intent";
