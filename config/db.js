const mongoose = require('mongoose'); 
const config = require('config'); 

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true }); // Leaving out: { useUnifiedTopology: true }, for now 

    console.log('MongoDB Connected :D'); 
  } catch (error) {
    console.log(error.message); 
    process.exit(1); // On Failure
  }
}

module.exports = connectDB; 