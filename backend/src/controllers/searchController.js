const inventory = require("../../data/inventory.json")

function searchItems(request, response, next) {
    try {
        const { q, category, minPrice, maxPrice } = request.query

        let results = inventory

        // Validate price range
        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
            const error = new Error("Invalid price range")
            error.statusCode = 400
            throw error
        }

        // Filter results based on query parameters
        if (q) {
            const query = q.toLowerCase()    
            results = results.filter(eachItem => eachItem.productName.toLowerCase().includes(query))
        }

        // Filter by category (case-insensitive)
        if (category) {
            const categoryQuery = category.toLowerCase()
            results = results.filter(eachItem => eachItem.category.toLowerCase() === categoryQuery)
        }

        // Filter by price range
        if (minPrice) {
            const min = Number(minPrice)
            if (!Number.isNaN(min)) {
                results = results.filter(eachItem => eachItem.price >= min)
            }
        }

        if (maxPrice) {
            const max = Number(maxPrice)
            if (!Number.isNaN(max)) {
                results = results.filter(eachItem => eachItem.price <= max)
            }
        }

        response.json(results)
    } catch(error) {
        next(error)
    }
}

module.exports = { searchItems }