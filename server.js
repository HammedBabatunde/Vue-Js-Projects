const express = require('express')
const app = express()
const bodyParser = require('body-parser')


//parses payload
app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/dist'))


app.get('/get-profile', function(req, res) { 
    //get data from database
    const response = {
        name: 'John Doe',
        email: 'olawale6708@gmail.com',
        interests: 'Football'
    }

    res.send(response)
})

app.post('/update-profile', function(req, res) {
    const payload = req.body
    console.log(payload)
    if (Object.keys(payload).length ===0 ) {
        res.status(400).send({error: "empty payload. Couldnt update user profile"})
    } else {
        //saving payload into database
        res.status(200).send({info: "user profile data updated successfully"})
    }
})

app.listen(3000, function() {
    console.log("app listening on port 3000")
})