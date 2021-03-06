const express = require('express'); 
const connectDB = require('./config/db'); 

const app = express(); 

// Connect DB 
connectDB(); 

app.get('/', (req, res) => res.send('API Running')); 

// Init Middleware 
app.use(express.json({ extended: false })); 

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts')); 

// // Bypass CORS 
// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', ['http://localhost:3000']); 
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', ['Content-Type', 'x-auth-token']);
//   next();
// }); 

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 