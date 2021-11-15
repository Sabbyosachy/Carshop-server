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
     const reviewsCollection=database.collection("reviews");
     const usersCollection=database.collection("users");


     //Get Products

     app.get('/products',async(req,res)=>{
      const cursor = productCollection.find({});
      const products=await cursor.toArray();
      res.json(products);
     });

     //Post Product
     app.post('/products',async(req,res)=>{
       const product=req.body;
       const result=await productCollection.insertOne(product);
       res.json(result);
     });
    

     //Review Get
     app.get('/reviews',async(req,res)=>{
      const cursor = reviewsCollection.find({});
      const result=await cursor.toArray();
      res.json(result);
     });

    //Review Post

    app.post('/reviews',async(req,res)=>{
      const review=req.body;
      const result=await reviewsCollection.insertOne(review);
      res.json(result);
    });

     //Post Order
     
     app.post('/orders',async(req,res)=>{
      const order=req.body;
      const result=await orderCollection.insertOne(order);
      res.json(result);

     });
    
     //Post users
     app.post('/users',async(req,res)=>{
       const user=req.body;
       const result=await usersCollection.insertOne(user);
       res.json(result);
     });

     //Get Users
     app.get('/users',async(req,res)=>{
      const cursor = usersCollection.find({});
      const result=await cursor.toArray();
      res.json(result);
     });
     
     //Put User

     app.put('/users',async(req,res)=>{
       const user=req.body;
       const filter={email:user.email};
       const options = { upsert: true };
       const updateDoc={$set:user};
       const result = await usersCollection.updateOne(filter, updateDoc, options);
       res.json(result);
     });

     //Admin verify
     app.put('/users/admin',async(req,res)=>{
       const user=req.body;
       const filter={email:user.email};
       const updateDoc={$set:{role:'Admin'}};
       const result=await usersCollection.updateOne(filter,updateDoc);
       res.json(result);
     })
     
    //Get Users by email
    app.get('/users/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email:email};
      const user=await usersCollection.findOne(query);
      let isAdmin=false;
      if(user?.role==='Admin'){
        isAdmin=true;
      }
      res.json({Admin:isAdmin});
    })


     //Get Order

     app.get('/orders',async(req,res)=>{
       const cursor=orderCollection.find({});
       const orders=await cursor.toArray();
       res.json(orders);
     });

     //Get By id
     app.get('/products/:id' ,async(req,res)=>{
     const id=req.params.id;
     const query={_id:ObjectId(id)};
     const product=await productCollection.findOne(query);
     res.json(product);

     });

       //Delete Order

       app.delete('/delorders/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const result=await orderCollection.deleteOne(query);
        res.send(result);
      });
      
      //Delete Products
       
      app.delete('/delproducts/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const result=await productCollection.deleteOne(query);
        res.send(result);
      });
       

   



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