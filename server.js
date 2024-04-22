const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb')
const  { isEmptyPayload, isInValidEmail } = require('./validator')
// require('dotenv').config();


// const { DB_USER, DB_PASS, DEV } = process.env

//connect to mongodb database
// const dbAddress = '127.0.0.1:27017'
// const url = DEV ? `mongodb://${dbAddress}` : `mongodb://${DB_USER}:${DB_PASS}@${dbAddress}?authSource=company_db`

const uri = process.env.MONGODB_URI

// const client = new MongoClient(url);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });


// Create database
const dbName = 'company_db';
const collName = 'employees';

//parses payload
app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/dist'))


app.get('/get-profile', async function(req, res) { 
    //connect to db
    await client.connect()
    console.log("Connected successfully to server")

    // initiate or get the db and collection
    const db = client.db(dbName)
    const collection = db.collection(collName)

    //get data from database
    const result = await collection.findOne({id: 1})
    client.close() 

    let response = {}

    if (result !== null) {  
        response = { 
            name: result.name,
            email: result.email,
            interests: result.interests
        }
    }

    res.send(response)
})

app.post('/update-profile', async function(req, res) {
    const payload = req.body
    console.log(payload)


    if (isEmptyPayload(payload) || isInValidEmail(payload)) {
        res.status(400).send({error: " "})
    } else {

        // connect to mongodb database
        await client.connect()
        console.log("Connected successfully to server")

        // initiate or get the db and collection
        const db = client.db(dbName)
        const collection = db.collection(collName)

        //saving payload into database
        payload['id'] = 1;
        const updatedValues = { $set: payload }
        await collection.updateOne({id: 1}, updatedValues, {upsert: true})
        client.close()

        res.status(200).send({info: "user profile data updated successfully"})
    }
})

const server = app.listen(process.env.SERVER_PORT, function() {
    console.log(`app listening on port ${process.env.SERVER_PORT}`)
})

module.exports = {
    app,
    server
}