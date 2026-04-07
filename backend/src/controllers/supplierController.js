const {getDb} = require("../db/connection")

async function createSupplier(request, response, next) {
    try {
        const {name, city} = request.body

        // validate input
        if (!name || !city) {
            const error = new Error("Name and city are required")
            error.statusCode = 400
            throw error
        }

        const trimmedName = name.trim()
        const trimmedCity = city.trim()

        // validate that trimmed values are not empty
        if (!trimmedName || !trimmedCity) {
            const error = new Error("Name and city cannot be empty")
            error.statusCode = 400
            throw error
        }

        // Insert supplier record
        const createSupplierQuery = `
            INSERT INTO suppliers (name, city)
            VALUES (?, ?);
        `

        // Get database connection
        const db = getDb()

        const result = await db.run(createSupplierQuery, [trimmedName, trimmedCity])

        response.status(201).json({
            message: "Supplier created successfully",
            supplier: {
                id: result.lastID,
                name: trimmedName,
                city: trimmedCity
            }
        })
    } catch(error) {
        next(error)
    }
}

module.exports = {
    createSupplier
}