import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedCustomer: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Customer CRUD operations
    addCustomer: (state, action) => {
      const newCustomer = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
        ordersCount: 0,
      };
      state.customers.push(newCustomer);
      state.loading = false;
      state.error = null;
    },

    updateCustomer: (state, action) => {
      const { id, ...updates } = action.payload;
      const customerIndex = state.customers.findIndex(
        (customer) => customer.id === id
      );
      if (customerIndex !== -1) {
        state.customers[customerIndex] = {
          ...state.customers[customerIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      state.loading = false;
      state.error = null;
    },

    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(
        (customer) => customer.id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },

    setCustomers: (state, action) => {
      state.customers = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Search functionality
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    // Selected customer
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },

    // Update customer order count
    updateCustomerOrderCount: (state, action) => {
      const { customerId, increment = true } = action.payload;
      const customer = state.customers.find((c) => c.id === customerId);
      if (customer) {
        customer.ordersCount = increment
          ? customer.ordersCount + 1
          : Math.max(0, customer.ordersCount - 1);
      }
    },

    // Bulk operations
    deleteMultipleCustomers: (state, action) => {
      const idsToDelete = action.payload;
      state.customers = state.customers.filter(
        (customer) => !idsToDelete.includes(customer.id)
      );
    },

    updateCustomerStatus: (state, action) => {
      const { id, status } = action.payload;
      const customer = state.customers.find((c) => c.id === id);
      if (customer) {
        customer.status = status;
        customer.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setCustomers,
  setSearchQuery,
  setSelectedCustomer,
  updateCustomerOrderCount,
  deleteMultipleCustomers,
  updateCustomerStatus,
} = customerSlice.actions;

// Selectors
export const selectAllCustomers = (state) => state.customers.customers;
export const selectCustomersLoading = (state) => state.customers.loading;
export const selectCustomersError = (state) => state.customers.error;
export const selectSearchQuery = (state) => state.customers.searchQuery;
export const selectSelectedCustomer = (state) =>
  state.customers.selectedCustomer;

export const selectFilteredCustomers = (state) => {
  const { customers, searchQuery } = state.customers;
  if (!searchQuery) return customers;

  return customers.filter(
    (customer) =>
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
  );
};

export const selectActiveCustomers = (state) =>
  state.customers.customers.filter((customer) => customer.status === "active");

export const selectCustomerById = (state, customerId) =>
  state.customers.customers.find((customer) => customer.id === customerId);

export default customerSlice.reducer;
