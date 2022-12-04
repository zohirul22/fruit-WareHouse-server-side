const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser"); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); 




const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.d4waz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const warehouseCollection = client.db("fruitWarehouse").collection("products");
        // find all data
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = warehouseCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        // find single data
        app.get('/products/:id' ,async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await warehouseCollection.findOne(query);
            res.send(product);
        })

        // post data
        app.post('/products', async(req,res) =>{
            const newProduct =req.body;
            const result = await warehouseCollection.insertOne(newProduct);
            res.send(result);
        })
        // delete data

        app.delete('/products/:id' , async(req ,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await warehouseCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('running server')
});

app.listen(port, () => {
    console.log(`listening to server `, port)
})