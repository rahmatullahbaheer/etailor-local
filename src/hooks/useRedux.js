import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";

// Custom hook for Redux with TypeScript-like experience
export const useRedux = () => {
  const dispatch = useDispatch();

  return {
    dispatch,
    useSelector,
  };
};

// Custom hooks for specific slices
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    dispatch,
  };
};

export const useCustomers = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers);

  const filteredCustomers = useMemo(() => {
    const { customers: customerList, searchQuery } = customers;
    if (!searchQuery) return customerList;

    return customerList.filter(
      (customer) =>
        customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery)
    );
  }, [customers.customers, customers.searchQuery]);

  const activeCustomers = useMemo(
    () =>
      customers.customers.filter((customer) => customer.status === "active"),
    [customers.customers]
  );

  const customerStats = useMemo(
    () => ({
      total: customers.customers.length,
      active: activeCustomers.length,
      inactive: customers.customers.length - activeCustomers.length,
      totalOrders: customers.customers.reduce(
        (sum, c) => sum + (c.ordersCount || 0),
        0
      ),
    }),
    [customers.customers, activeCustomers.length]
  );

  return {
    ...customers,
    filteredCustomers,
    activeCustomers,
    customerStats,
    dispatch,
  };
};

export const useOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);

  const filteredOrders = useMemo(() => {
    const { orders: orderList, searchQuery, filterStatus } = orders;
    let filtered = orderList;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customer?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customer?.phone?.includes(searchQuery)
      );
    }

    return filtered;
  }, [orders.orders, orders.searchQuery, orders.filterStatus]);

  const recentOrders = useMemo(
    () => orders.orders.slice(0, 5),
    [orders.orders]
  );

  const orderStats = useMemo(() => {
    const orderList = orders.orders;
    return {
      total: orderList.length,
      pending: orderList.filter((o) => o.status === "pending").length,
      inProgress: orderList.filter((o) => o.status === "in-progress").length,
      completed: orderList.filter((o) => o.status === "completed").length,
      cancelled: orderList.filter((o) => o.status === "cancelled").length,
      totalRevenue: orderList
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0),
    };
  }, [orders.orders]);

  return {
    ...orders,
    filteredOrders,
    recentOrders,
    orderStats,
    dispatch,
  };
};

export const useMeasurements = () => {
  const dispatch = useDispatch();
  const measurements = useSelector((state) => state.measurements);

  const measurementsByCategory = useMemo(() => {
    const { measurements: measurementList, selectedCategory } = measurements;
    if (selectedCategory === "all") return measurementList;
    return measurementList.filter((m) => m.category === selectedCategory);
  }, [measurements.measurements, measurements.selectedCategory]);

  const templatesByCategory = useMemo(() => {
    const { templates, selectedCategory } = measurements;
    if (selectedCategory === "all") return templates;
    return templates.filter((t) => t.category === selectedCategory);
  }, [measurements.templates, measurements.selectedCategory]);

  return {
    ...measurements,
    measurementsByCategory,
    templatesByCategory,
    dispatch,
  };
};

export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  const unreadNotifications = useMemo(
    () => notifications.notifications.filter((n) => !n.isRead),
    [notifications.notifications]
  );

  const recentNotifications = useMemo(
    () => notifications.notifications.slice(0, 5),
    [notifications.notifications]
  );

  const notificationsByType = useMemo(() => {
    const byType = {};
    notifications.notifications.forEach((notification) => {
      if (!byType[notification.type]) {
        byType[notification.type] = [];
      }
      byType[notification.type].push(notification);
    });
    return byType;
  }, [notifications.notifications]);

  return {
    ...notifications,
    unreadNotifications,
    recentNotifications,
    notificationsByType,
    dispatch,
  };
};
