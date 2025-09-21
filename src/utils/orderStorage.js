import * as SQLite from "expo-sqlite";

// Database configuration
const DB_NAME = "etailor.db";
const DB_VERSION = 2; // Incremented for suit_images table

// Initialize database
let db = null;
let isInitializing = false;

const initDatabase = async () => {
  if (isInitializing) {
    // Wait for existing initialization to complete
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return db;
  }

  try {
    isInitializing = true;
    console.log("Initializing database...");

    db = await SQLite.openDatabaseAsync(DB_NAME);

    if (!db) {
      throw new Error("Failed to open database");
    }

    // Enable foreign keys
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Create tables
    await createTables();

    // Handle database migrations
    await handleMigrations();

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    db = null; // Reset db on error
    throw error;
  } finally {
    isInitializing = false;
  }
};

const createTables = async () => {
  try {
    if (!db) {
      throw new Error("Database not initialized");
    }

    console.log("Creating tables...");

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

    // Suit images table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS suit_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        image_id TEXT NOT NULL,
        image_uri TEXT NOT NULL,
        image_name TEXT,
        image_type TEXT DEFAULT 'image/jpeg',
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

const handleMigrations = async () => {
  try {
    if (!db) {
      throw new Error("Database not initialized");
    }

    // Check if suit_images table exists
    const tableExists = await db.getFirstAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='suit_images'
    `);

    if (!tableExists) {
      console.log("Creating suit_images table...");
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS suit_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT NOT NULL,
          image_id TEXT NOT NULL,
          image_uri TEXT NOT NULL,
          image_name TEXT,
          image_type TEXT DEFAULT 'image/jpeg',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
        );
      `);
      console.log("suit_images table created successfully");
    }

    console.log("Database migrations completed");
  } catch (error) {
    console.error("Error handling migrations:", error);
    throw error;
  }
};

// Ensure database is initialized
const ensureDbInitialized = async () => {
  try {
    if (!db) {
      console.log("Database not found, initializing...");
      await initDatabase();
    }

    if (!db) {
      throw new Error("Database initialization failed");
    }

    return db;
  } catch (error) {
    console.error("Error ensuring database initialization:", error);
    throw error;
  }
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

      // Validate required data before starting transaction
      if (!orderData.customer?.name || !orderData.customer?.phone) {
        throw new Error("Customer name and phone are required");
      }

      if (!orderData.order?.totalAmount) {
        throw new Error("Total amount is required");
      }

      let result = null;

      // Start transaction
      await db.withTransactionAsync(async () => {
        try {
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
          if (orderData.measurements && Array.isArray(orderData.measurements)) {
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
          }

          // Insert suit images
          if (
            orderData.order.suitImages &&
            Array.isArray(orderData.order.suitImages)
          ) {
            console.log(
              `Inserting ${orderData.order.suitImages.length} suit images...`
            );
            for (const image of orderData.order.suitImages) {
              if (image.uri && image.id) {
                try {
                  await db.runAsync(
                    `INSERT INTO suit_images 
                     (order_id, image_id, image_uri, image_name, image_type) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                      orderId,
                      image.id,
                      image.uri,
                      image.name || `suit_image_${image.id}.jpg`,
                      image.type || "image/jpeg",
                    ]
                  );
                  console.log(`Inserted suit image: ${image.id}`);
                } catch (imageError) {
                  console.error(
                    `Error inserting suit image ${image.id}:`,
                    imageError
                  );
                  throw new Error(
                    `Failed to save suit image: ${imageError.message}`
                  );
                }
              }
            }
          }
        } catch (transactionError) {
          console.error("Transaction error:", transactionError);
          throw transactionError;
        }
      });

      // Get the created order after successful transaction
      result = await this.getOrderById(orderId);
      return result;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  },

  // Get all orders with customer info
  async getAllOrders() {
    try {
      console.log("Getting all orders...");
      const database = await ensureDbInitialized();

      if (!database) {
        throw new Error("Database not available");
      }

      console.log("Executing orders query...");
      const result = await database.getAllAsync(`
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

      console.log(`Found ${result.length} orders`);
      const orders = [];

      for (const row of result) {
        try {
          const measurements = await database.getAllAsync(
            "SELECT * FROM measurements WHERE order_id = ? ORDER BY id",
            [row.order_id]
          );

          const suitImages = await database.getAllAsync(
            "SELECT * FROM suit_images WHERE order_id = ? ORDER BY created_at",
            [row.order_id]
          );

          orders.push({
            id: row.order_id,
            customer: {
              name: row.customer_name || "Unknown Customer",
              phone: row.customer_phone || "",
              email: row.customer_email || "",
              address: row.customer_address || "",
              image: row.customer_image || null,
            },
            order: {
              deliveryDate: row.delivery_date,
              totalAmount: (row.total_amount || 0).toString(),
              advanceAmount: (row.advance_amount || 0).toString(),
              suitCount: (row.suit_count || 0).toString(),
              description: row.description || "",
              suitImages: suitImages.map((img) => ({
                id: img.image_id,
                uri: img.image_uri,
                name: img.image_name,
                type: img.image_type,
              })),
            },
            measurements: measurements.map((m) => ({
              enName: m.en_name || "",
              urName: m.ur_name || "",
              value: m.value || "",
              image: m.image_uri || null,
            })),
            status: row.status || "pending",
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          });
        } catch (measurementError) {
          console.error(
            "Error processing measurements for order:",
            row.order_id,
            measurementError
          );
          // Continue with order but without measurements
          orders.push({
            id: row.order_id,
            customer: {
              name: row.customer_name || "Unknown Customer",
              phone: row.customer_phone || "",
              email: row.customer_email || "",
              address: row.customer_address || "",
              image: row.customer_image || null,
            },
            order: {
              deliveryDate: row.delivery_date,
              totalAmount: (row.total_amount || 0).toString(),
              advanceAmount: (row.advance_amount || 0).toString(),
              suitCount: (row.suit_count || 0).toString(),
              description: row.description || "",
              suitImages: [],
            },
            measurements: [],
            status: row.status || "pending",
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          });
        }
      }

      console.log(`Processed ${orders.length} orders successfully`);
      return orders;
    } catch (error) {
      console.error("Error getting orders:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
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

      if (!orderId) {
        throw new Error("Order ID is required");
      }

      await db.withTransactionAsync(async () => {
        try {
          // Delete measurements (cascade should handle this, but being explicit)
          await db.runAsync("DELETE FROM measurements WHERE order_id = ?", [
            orderId,
          ]);

          // Delete suit images (cascade should handle this, but being explicit)
          await db.runAsync("DELETE FROM suit_images WHERE order_id = ?", [
            orderId,
          ]);

          // Delete order
          await db.runAsync("DELETE FROM orders WHERE order_id = ?", [orderId]);

          // Optionally delete customer if no other orders exist
          // (You might want to keep customers for future orders)
        } catch (transactionError) {
          console.error("Delete transaction error:", transactionError);
          throw transactionError;
        }
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

  // Delete customer
  async deleteCustomer(customerId) {
    try {
      await ensureDbInitialized();

      if (!customerId) {
        throw new Error("Customer ID is required");
      }

      // Check if customer has any orders
      const orders = await db.getAllAsync(
        "SELECT COUNT(*) as count FROM orders WHERE customer_id = ?",
        [customerId]
      );

      if (orders[0].count > 0) {
        throw new Error("Cannot delete customer with existing orders");
      }

      await db.withTransactionAsync(async () => {
        try {
          // Delete customer
          await db.runAsync("DELETE FROM customers WHERE customer_id = ?", [
            customerId,
          ]);
        } catch (transactionError) {
          console.error("Delete customer transaction error:", transactionError);
          throw transactionError;
        }
      });

      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  },

  // Update customer
  async updateCustomer(customerId, customerData) {
    try {
      await ensureDbInitialized();

      if (!customerId) {
        throw new Error("Customer ID is required");
      }

      const now = new Date().toISOString();

      await db.runAsync(
        `UPDATE customers 
         SET name = ?, phone = ?, email = ?, address = ?, image_uri = ?, updated_at = ?
         WHERE customer_id = ?`,
        [
          customerData.name,
          customerData.phone,
          customerData.email || null,
          customerData.address || null,
          customerData.image || null,
          now,
          customerId,
        ]
      );

      return await this.getCustomerById(customerId);
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  },
};

// Utility functions
export const StorageUtils = {
  // Initialize database (call this in your App.js)
  async initializeDatabase() {
    try {
      const database = await initDatabase();
      console.log("Database initialization completed");

      // Test database connection
      await this.testDatabaseConnection();

      return database;
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  },

  // Test database connection
  async testDatabaseConnection() {
    try {
      console.log("Testing database connection...");
      const database = await ensureDbInitialized();

      if (!database) {
        throw new Error("Database is null");
      }

      // Simple test query
      const result = await database.getFirstAsync("SELECT 1 as test");

      if (result && result.test === 1) {
        console.log("Database connection test passed");
        return true;
      } else {
        throw new Error("Database test query failed");
      }
    } catch (error) {
      console.error("Database connection test failed:", error);
      throw error;
    }
  },

  // Test database connection
  async testDatabase() {
    try {
      console.log("Testing database connection...");
      await ensureDbInitialized();

      // Test basic query
      const result = await db.getFirstAsync("SELECT 1 as test");
      console.log("Database test result:", result);

      // Test table existence
      const tables = await db.getAllAsync(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN ('customers', 'orders', 'measurements', 'suit_images')
      `);
      console.log("Available tables:", tables);

      return {
        connected: true,
        tables: tables.map((t) => t.name),
        version: DB_VERSION,
      };
    } catch (error) {
      console.error("Database test failed:", error);
      return {
        connected: false,
        error: error.message,
        version: DB_VERSION,
      };
    }
  },

  // Reset database (recreate tables)
  async resetDatabase() {
    try {
      console.log("Resetting database...");

      // Close existing connection
      if (db) {
        await db.closeAsync();
        db = null;
      }

      // Reinitialize database
      await initDatabase();

      console.log("Database reset successfully");
      return true;
    } catch (error) {
      console.error("Error resetting database:", error);
      throw error;
    }
  },

  // Clear all data (for testing/reset)
  async clearAllData() {
    try {
      await ensureDbInitialized();

      await db.withTransactionAsync(async () => {
        try {
          await db.runAsync("DELETE FROM measurements");
          await db.runAsync("DELETE FROM suit_images");
          await db.runAsync("DELETE FROM orders");
          await db.runAsync("DELETE FROM customers");
          await db.runAsync("DELETE FROM draft_orders");
        } catch (transactionError) {
          console.error("Clear data transaction error:", transactionError);
          throw transactionError;
        }
      });
    } catch (error) {
      console.error("Error clearing all data:", error);
      throw error;
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
