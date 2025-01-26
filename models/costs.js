const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const costSchema = new Schema({
    description: { type: String, required: true },
    category: { type: String, required: true },
    user_id: { type: String, ref: 'User', required: true  },
    sum: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

const Cost = mongoose.model('costs',costSchema);
module.exports = Cost;
