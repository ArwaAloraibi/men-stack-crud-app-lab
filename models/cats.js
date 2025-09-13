const mongoose = require('mongoose')

const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  isReadyToAdopt: { type: Boolean, default: false }, 
})

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
