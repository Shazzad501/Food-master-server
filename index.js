const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middle weres
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
  res.send("Food Master here!!")
})

app.listen(port, ()=>{
  console.log(`Food Create on port: ${port}`)
})