const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cknbh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('freshFruit').collection('item');

        app.get('/item', async(req,res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/item/:id', async(req,res) =>{
            const id =req.params.id;
            const query={_id: ObjectId(id)};
            const item = await serviceCollection.findOne(query);
            res.send(item);
        });

//  post

        app.post('/item', async(req, res) =>{
            const newItem = req.body;
            const result = await serviceCollection.insertOne(newItem);
            res.send(result);
        });

        app.put('/item', async(req, res) =>{
            const id = req?.query?.itemId;
            const quantity = req.body.newQuantity;
            console.log(quantity)
            const filter = { _id: ObjectId(id) };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // create a document that sets the plot of the movie
            const updateDoc = {
              $set: {
                quantity
              },
            };
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        });

//  Delet

        app.delete('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req,res) => {
    res.send('running server');
});



app.listen(port, () =>{
    console.log('listening to port', port);
})