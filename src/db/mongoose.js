const mongoose = require('mongoose');
MONGO_URL = 'mongodb+srv://Pratik:pratik%40123@cluster0.72qesto.mongodb.net/'
try{
mongoose.connect(MONGO_URL);
console.log("Mongoose connected")
} catch (e) {
    throw new Error ('Error')
}