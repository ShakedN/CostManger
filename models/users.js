const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: Date, required: true },
    marital_status: { type: String, required: true },
    computed_costs: { // השדה המחושב
        type: Map, // מבנה שמאפשר שמירה של זוגות key-value
        of: Map,  // כל מפתח חודש מצביע למפה נוספת שמייצגת קטגוריות וסכומים
        default: {} // ברירת מחדל - אובייקט ריק
    }
});

const User = mongoose.model('users',userSchema);
module.exports = User;
