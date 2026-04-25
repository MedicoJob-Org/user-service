require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { ensureDemoUsers } = require('./utils/seedDemoUsers');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI_USER || process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ User Service DB Connected');
    await ensureDemoUsers();
    console.log('👥 Demo users ensured');
  })
  .catch(err => {
    console.error('❌ MONGODB CONNECTION ERROR:', err.message);
    if (err.message.includes('Authentication failed')) {
      console.error('👉 Tip: Check your username and password in the .env file.');
    }
    if (err.message.includes('querySrv ETIMEOUT')) {
      console.error('👉 Tip: Your internet or firewall might be blocking MongoDB Atlas.');
    }
  });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
