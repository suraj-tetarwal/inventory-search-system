const express = require("express")

const supplierController = require("../controllers/supplierController") 

const router = express.Router()

router.post("/", supplierController.createSupplier)

module.exports = router