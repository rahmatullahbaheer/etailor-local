import * as SQLite from "expo-sqlite";

// Database configuration
const DB_NAME = "etailor.db";
const DB_VERSION = 1;

// Initialize database
let db = null;

const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    // Enable foreign keys
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Create tables
    await createTables();

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

const createTables = async () => {
  try {
    // Customers table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        address TEXT,
        image_uri TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Orders table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        customer_id TEXT NOT NULL,
        delivery_date DATETIME NOT NULL,
        total_amount REAL NOT NULL,
        advance_amount REAL DEFAULT 0,
        suit_count INTEGER DEFAULT 0,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
      );
    `);

    // Measurements table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        en_name TEXT NOT NULL,
        ur_name TEXT,
        value TEXT,
        image_uri TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
      );
    `);

    // Draft orders table (for auto-save functionality)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS draft_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        step INTEGER DEFAULT 1,
        form_data TEXT,
        order_details TEXT,
        measurements_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

// Ensure database is initialized
const ensureDbInitialized = async () => {
  if (!db) {
    await initDatabase();
  }
  return db;
};

// Order Management Functions
export const OrderStorage = {
  // Save a new order
  async saveOrder(orderData) {
    try {
      await ensureDbInitialized();

      const orderId = `ORD-${Date.now()}`;
      const customerId = `CUST-${Date.now()}`;
      const now = new Date().toISOString();

      // Start transaction
      await db.withTransactionAsync(async () => {
        // Insert customer
        await db.runAsync(
          `INSERT OR REPLACE INTO customers 
           (customer_id, name, phone, email, address, image_uri, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            customerId,
            orderData.customer.name,
            orderData.customer.phone,
            orderData.customer.email || null,
            orderData.customer.address || null,
            orderData.customer.image || null,
            now,
            now,
          ]
        );

        // Insert order
        await db.runAsync(
          `INSERT INTO orders 
           (order_id, customer_id, delivery_date, total_amount, advance_amount, 
            suit_count, description, status, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            customerId,
            orderData.order.deliveryDate,
            parseFloat(orderData.order.totalAmount) || 0,
            parseFloat(orderData.order.advanceAmount) || 0,
            parseInt(orderData.order.suitCount) || 0,
            orderData.order.description || null,
            "pending",
            now,
            now,
          ]
        );

        // Insert measurements
        for (const measurement of orderData.measurements) {
          if (measurement.enName || measurement.value) {
            await db.runAsync(
              `INSERT INTO measurements 
               (order_id, en_name, ur_name, value, image_uri) 
               VALUES (?, ?, ?, ?, ?)`,
              [
                orderId,
                measurement.enName || "",
                measurement.urName || "",
                measurement.value || "",
                measurement.image || null,
              ]
            );
          }
        }
      });

      // Return the created order
      return await this.getOrderById(orderId);
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  },

  // Get all orders with customer info
  async getAllOrders() {
    try {
      await ensureDbInitialized();

      const result = await db.getAllAsync(`
        SELECT 
          o.*,
          c.name as customer_name,
          c.phone as customer_phone,
          c.email as customer_email,
          c.address as customer_address,
          c.image_uri as customer_image
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        ORDER BY o.created_at DESC
      `);

      const orders = [];
      for (const row of result) {
        const measurements = await db.getAllAsync(
          "SELECT * FROM measurements WHERE order_id = ? ORDER BY id",
          [row.order_id]
        );

        orders.push({
          id: row.order_id,
          customer: {
            name: row.customer_name,
            phone: row.customer_phone,
            email: row.customer_email,
            address: row.customer_address,
            image: row.customer_image,
          },
          order: {
            deliveryDate: row.delivery_date,
            totalAmount: row.total_amount.toString(),
            advanceAmount: row.advance_amount.toString(),
            suitCount: row.suit_count.toString(),
            description: row.description,
          },
          measurements: measurements.map((m) => ({
            enName: m.en_name,
            urName: m.ur_name,
            value: m.value,
            image: m.image_uri,
          })),
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
      }

      return orders;
    } catch (error) {
      console.error("Error getting orders:", error);
      return [];
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      await ensureDbInitialized();

      const orders = await this.getAllOrders();
      return orders.find((order) => order.id === orderId) || null;
    } catch (error) {
      console.error("Error getting order by ID:", error);
      return null;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      await ensureDbInitialized();

      const now = new Date().toISOString();
      await db.runAsync(
        "UPDATE orders SET status = ?, updated_at = ? WHERE order_id = ?",
        [status, now, orderId]
      );

      return await this.getOrderById(orderId);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(orderId) {
    try {
      await ensureDbInitialized();

      await db.withTransactionAsync(async () => {
        // Delete measurements (cascade should handle this, but being explicit)
        await db.runAsync("DELETE FROM measurements WHERE order_id = ?", [
          orderId,
        ]);

        // Delete order
        await db.runAsync("DELETE FROM orders WHERE order_id = ?", [orderId]);

        // Optionally delete customer if no other orders exist
        // (You might want to keep customers for future orders)
      });

      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  // Get orders by status
  async getOrdersByStatus(status) {
    try {
      const orders = await this.getAllOrders();
      return orders.filter((order) => order.status === status);
    } catch (error) {
      console.error("Error getting orders by status:", error);
      return [];
    }
  },

  // Search orders by customer name
  async searchOrdersByCustomer(customerName) {
    try {
      await ensureDbInitialized();

      const result = await db.getAllAsync(
        `
        SELECT 
          o.*,
          c.name as customer_name,
          c.phone as customer_phone,
          c.email as customer_email,
          c.address as customer_address,
          c.image_uri as customer_image
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        WHERE c.name LIKE ?
        ORDER BY o.created_at DESC
      `,
        [`%${customerName}%`]
      );

      const orders = [];
      for (const row of result) {
        const measurements = await db.getAllAsync(
          "SELECT * FROM measurements WHERE order_id = ? ORDER BY id",
          [row.order_id]
        );

        orders.push({
          id: row.order_id,
          customer: {
            name: row.customer_name,
            phone: row.customer_phone,
            email: row.customer_email,
            address: row.customer_address,
            image: row.customer_image,
          },
          order: {
            deliveryDate: row.delivery_date,
            totalAmount: row.total_amount.toString(),
            advanceAmount: row.advance_amount.toString(),
            suitCount: row.suit_count.toString(),
            description: row.description,
          },
          measurements: measurements.map((m) => ({
            enName: m.en_name,
            urName: m.ur_name,
            value: m.value,
            image: m.image_uri,
          })),
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
      }

      return orders;
    } catch (error) {
      console.error("Error searching orders:", error);
      return [];
    }
  },
};

// Draft Order Management
export const DraftStorage = {
  // Save draft order
  async saveDraft(draftData) {
    try {
      await ensureDbInitialized();

      const now = new Date().toISOString();

      // Clear existing draft first
      await db.runAsync("DELETE FROM draft_orders");

      // Insert new draft
      await db.runAsync(
        `INSERT INTO draft_orders 
         (step, form_data, order_details, measurements_data, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          draftData.step,
          JSON.stringify(draftData.formData),
          JSON.stringify(draftData.orderDetails),
          JSON.stringify(draftData.measurements),
          now,
          now,
        ]
      );
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  },

  // Load draft order
  async loadDraft() {
    try {
      await ensureDbInitialized();

      const result = await db.getFirstAsync(
        "SELECT * FROM draft_orders ORDER BY updated_at DESC LIMIT 1"
      );

      if (result) {
        return {
          step: result.step,
          formData: JSON.parse(result.form_data),
          orderDetails: JSON.parse(result.order_details),
          measurements: JSON.parse(result.measurements_data),
          timestamp: result.updated_at,
        };
      }

      return null;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    }
  },

  // Clear draft
  async clearDraft() {
    try {
      await ensureDbInitialized();
      await db.runAsync("DELETE FROM draft_orders");
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  },

  // Check if draft exists
  async hasDraft() {
    try {
      await ensureDbInitialized();
      const result = await db.getFirstAsync(
        "SELECT COUNT(*) as count FROM draft_orders"
      );
      return result.count > 0;
    } catch (error) {
      console.error("Error checking draft:", error);
      return false;
    }
  },
};

// Customer Management
export const CustomerStorage = {
  // Get all customers
  async getAllCustomers() {
    try {
      await ensureDbInitialized();

      const result = await db.getAllAsync(`
        SELECT * FROM customers 
        ORDER BY created_at DESC
      `);

      return result.map((row) => ({
        id: row.customer_id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        address: row.address,
        image: row.image_uri,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error("Error getting customers:", error);
      return [];
    }
  },

  // Get customer by ID
  async getCustomerById(customerId) {
    try {
      await ensureDbInitialized();

      const result = await db.getFirstAsync(
        "SELECT * FROM customers WHERE customer_id = ?",
        [customerId]
      );

      if (result) {
        return {
          id: result.customer_id,
          name: result.name,
          phone: result.phone,
          email: result.email,
          address: result.address,
          image: result.image_uri,
          createdAt: result.created_at,
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting customer by ID:", error);
      return null;
    }
  },
};

// Utility functions
export const StorageUtils = {
  // Initialize database (call this in your App.js)
  async initializeDatabase() {
    return await initDatabase();
  },

  // Clear all data (for testing/reset)
  async clearAllData() {
    try {
      await ensureDbInitialized();

      await db.withTransactionAsync(async () => {
        await db.runAsync("DELETE FROM measurements");
        await db.runAsync("DELETE FROM orders");
        await db.runAsync("DELETE FROM customers");
        await db.runAsync("DELETE FROM draft_orders");
      });
    } catch (error) {
      console.error("Error clearing all data:", error);
    }
  },

  // Get storage info
  async getStorageInfo() {
    try {
      await ensureDbInitialized();

      const ordersCount = await db.getFirstAsync(
        "SELECT COUNT(*) as count FROM orders"
      );
      const customersCount = await db.getFirstAsync(
        "SELECT COUNT(*) as count FROM customers"
      );
      const pendingCount = await db.getFirstAsync(
        "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"
      );
      const completedCount = await db.getFirstAsync(
        "SELECT COUNT(*) as count FROM orders WHERE status = 'completed'"
      );
      const hasDraft = await DraftStorage.hasDraft();

      return {
        totalOrders: ordersCount.count,
        totalCustomers: customersCount.count,
        hasDraft,
        pendingOrders: pendingCount.count,
        completedOrders: completedCount.count,
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return null;
    }
  },

  // Export data (for backup)
  async exportData() {
    try {
      const orders = await OrderStorage.getAllOrders();
      const customers = await CustomerStorage.getAllCustomers();

      return {
        orders,
        customers,
        exportDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error exporting data:", error);
      return null;
    }
  },
};
