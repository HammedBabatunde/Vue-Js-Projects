const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const  { isEmptyPayload, isInValidEmail } = require('./validator')

//connect to mongodb database
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

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
        res.status(400).send({error: "invalid payload. Couldnt update user profile"})
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

app.listen(3000, function() {
    console.log("app listening on port 3000")
})