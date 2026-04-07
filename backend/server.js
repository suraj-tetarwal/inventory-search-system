require('dotenv').config();

const express = require('express');
const cors = require('cors');

// import database connection
const { initializeDb } = require('./src/db/connection');

// import routes
const searchRoutes = require('./src/routes/searchRoutes');
const supplierRoutes = require('./src/routes/supplierRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');

// import error handling middleware
const errorhandler = require('./src/middleware/errorHandler');

const app = express()

// built-in middleware
app.use(cors());
app.use(express.json());

const startServer = async () => {
    try {
        // initialize database connection
        await initializeDb()

        // routes
        app.use("/search", searchRoutes)
        app.use("/supplier", supplierRoutes)
        app.use("/inventory", inventoryRoutes)

        // error handling middleware
        app.use(errorhandler)

        // PORT from .env or default
        const PORT = process.env.PORT || 5000;

       // Start server 
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()