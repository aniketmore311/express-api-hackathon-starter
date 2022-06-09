const mongoose = require('mongoose');



async function main() {
    await mongoose.connect('mongodb://localhost:27017/');
    console.log("Mongoose connected !");
}

module.exports = main;