require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDb connected'))
.catch((err) => console.log(err))

const authRoutes = require("./routes/auth.js");
const profileRoutes = require('./routes/profile');




app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.listen(PORT,() => console.log(PORT));
