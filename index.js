const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edakp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function run(){
 
  try{
     await client.connect();
     console.log('connected successsfully');
     const database = client.db("Add_Products");
     const productCollection = database.collection("products");
     const orderCollection = database.collection("orders");


     //Get Products

     app.get('/products',async(req,res)=>{
      const cursor = productCollection.find({});
      const products=await cursor.toArray();
      res.json(products);
     })
    
     //Post Order
     
     app.post('/orders',async(req,res)=>{
      const order=req.body;
      const result=await orderCollection.insertOne(order);
      res.json(result);

     })

     //Get By id
     app.get('/products/:id' ,async(req,res)=>{
     const id=req.params.id;
     const query={_id:ObjectId(id)};
     const product=await productCollection.findOne(query);
     res.json(product);

     })
     
   



  }
  finally{
    // await client.close();
}

}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Zee cars!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})