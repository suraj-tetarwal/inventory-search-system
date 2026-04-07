const { getDb } = require("../db/connection");

async function createInventory(request, response, next) {
  try {
    const { supplier_id, product_name, quantity, price } = request.body;

    // Validate required fields
    if (
      supplier_id === undefined ||
      !product_name ||
      quantity === undefined ||
      price === undefined
    ) {
      const error = new Error(
        "Supplier ID, product name, quantity, and price are required",
      );
      error.statusCode = 400;
      throw error;
    }

    const parsedSupplierId = parseInt(supplier_id);
    if (Number.isNaN(parsedSupplierId)) {
      const error = new Error("Supplier ID must be a valid number");
      error.statusCode = 400;
      throw error;
    }

    // Validate product name
    const trimmedProductName = product_name.trim();
    if (!trimmedProductName) {
      const error = new Error("Product name cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    // Validate quantity and price
    const parsedQuantity = parseInt(quantity);
    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      const error = new Error("Quantity must be a non-negative integer");
      error.statusCode = 400;
      throw error;
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      const error = new Error("Price must be greater than 0");
      error.statusCode = 400;
      throw error;
    }

    // Check if supplier exists
    const getSupplierQuery = `
            SELECT id FROM suppliers WHERE id = ?;
        `;

    // Get database connection
    const db = getDb();

    const supplier = await db.get(getSupplierQuery, [parsedSupplierId]);

    // If supplier does not exist, return 404
    if (!supplier) {
      const error = new Error("Supplier not found");
      error.statusCode = 400;
      throw error;
    }

    // Insert inventory record
    const createInventoryQuery = `
            INSERT INTO inventory (supplier_id, product_name, quantity, price)
            VALUES (?, ?, ?, ?);
        `;

    const result = await db.run(createInventoryQuery, [
      parsedSupplierId,
      trimmedProductName,
      parsedQuantity,
      parsedPrice,
    ]);

    response.status(201).json({
      message: "Inventory created successfully",
      inventory: {
        id: result.lastID,
        supplier_id: parsedSupplierId,
        product_name: trimmedProductName,
        quantity: parsedQuantity,
        price: parsedPrice,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getInventory(request, response, next) {
  try {
    // Get database connection
    const db = getDb();

    // Join inventory with suppliers to get supplier details along with inventory items
    const getInventoryQuery = `
            SELECT
                i.id,
                i.product_name,
                i.quantity,
                i.price,
                s.name AS supplier_name,
                s.city AS supplier_city
            FROM
                inventory i INNER JOIN suppliers s ON i.supplier_id = s.id
            ORDER BY i.id DESC;
        `;

    const inventoryList = await db.all(getInventoryQuery);

    response.status(200).json({
      count: inventoryList.length,
      inventory: inventoryList,
    });
  } catch (error) {
    next(error);
  }
}

async function getInventorySummary(request, response, next) {
  try {
    // Get database connection
    const db = getDb();

    // join suppliers with inventory to get summary of total products, quantity, and value for each supplier
    const getSummaryQuery = `
            SELECT
                s.id AS supplier_id,
                s.name AS supplier_name,
                s.city AS supplier_city,
                COUNT(i.id) AS total_products,
                SUM(i.quantity) AS total_quantity,
                SUM(i.quantity * i.price) AS total_value
            FROM
                suppliers s LEFT JOIN inventory i ON s.id = i.supplier_id
            GROUP BY s.id, s.name, s.city
            ORDER BY total_value DESC;
        `;

    const summaryList = await db.all(getSummaryQuery);

    response.status(200).json({
      count: summaryList.length,
      summary: summaryList,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createInventory,
  getInventory,
  getInventorySummary,
};
