const express = require("express")

const inventoryController = require("../controllers/inventoryController")

const router = express.Router()


router.post("/", inventoryController.createInventory)
router.get("/", inventoryController.getInventory)
router.get("/summary", inventoryController.getInventorySummary)

module.exports = router