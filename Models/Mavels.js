let mongoose = require("mongoose");

let schemmerMavel = new mongoose.Schema({
    name: String,
    image: String,
    level: Number,
})

module.exports = mongoose.model("Mavels", schemmerMavel)