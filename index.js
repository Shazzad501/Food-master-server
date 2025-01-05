const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middle weres
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wlddb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const usersCollection = client.db("foodMasterDB").collection('users');
    const menuCollection = client.db("foodMasterDB").collection('menu');
    const reviewCollection = client.db("foodMasterDB").collection('review');
    const cartCollection = client.db("foodMasterDB").collection('cart');

    // user related api 
    // user info post api
    app.post('/users', async(req, res)=>{
      const user = req.body;
      // save user if user doesn't existed
      const query = {email: user.email}
      const exitedUser = await usersCollection.findOne(query)
      if(exitedUser){
        return res.send({message: 'user all ready save.', insertedId: null})
      }
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })

    // get all user
    app.get('/users', async(req, res)=>{
      const result = await usersCollection.find().toArray()
      res.send(result);
    })

    // get all menu into db
    app.get('/menu', async(req, res)=>{
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    // get all reviews into the db
    app.get('/review', async(req, res)=>{
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // post a cart into the db
    app.post('/carts', async(req, res)=>{
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })
    // get all cart into the db
    app.get('/carts', async(req, res)=>{
      const email = req.query.email;
      const query = {userEmail: email}
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })

    // delete a cart with id
    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
  res.send("Food Master here!!");
});

app.listen(port, ()=>{
  console.log(`Food Create on port: ${port}`)
})