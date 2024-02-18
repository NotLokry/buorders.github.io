const mongoose = require("mongoose")
const OrderModel = new mongoose.Schema({
    kieno:{ type: String, required: true, unique: false},
    kam:{ type: String, required: true},
    uzsakymas:{ type: String, required: true},
    atlikta:{ type: Boolean ,required: true},
    grynais:{ type: Boolean ,required: true},
})
const model = mongoose.model("OrderSchema", OrderModel)
module.exports = model