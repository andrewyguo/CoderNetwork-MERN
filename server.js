const express = require('express'); 
const connectDB = require('./config/db'); 

const app = express(); 

// Connect DB 
connectDB(); 

app.get('/', (req, res) => res.send('API Running')); 

// Init Middleware 
app.use(express.json({ extended: false })); 

// Use routes 
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const auth = require('./routes/api/auth'); 
app.use('/api/users', users); 
app.use('/api/profile', profile); 
app.use('/api/posts', posts); 
app.use('/api/auth', auth); 

// // Bypass CORS 
// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', ['http://localhost:3000']); 
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', ['Content-Type', 'x-auth-token']);
//   next();
// }); 

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 