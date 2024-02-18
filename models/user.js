const mongoose = require("mongoose")
const UserModel = new mongoose.Schema({
    name:{ type: String, required: true, unique:true,sparse: true,sparse: true},
    password:{ type: String, required: true, unique:true,sparse: true},
    kurjeris:{ type: Boolean ,required: true},
    grynais:{ type: Boolean ,required: true},
})
const model = mongoose.model("UserSchema", UserModel)
module.exports = model