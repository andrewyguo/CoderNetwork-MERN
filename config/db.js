const mongoose = require('mongoose'); 
const config = require('config'); 

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }); 

    console.log('MongoDB Connected :D'); 
  } catch (error) {
    console.log(error.message); 
    process.exit(1); // On Failure
  }
}

module.exports = connectDB; 