const express = require('express')
const app = express()

app.use('/', express.static(__dirname + '/'))

app.post('/save-task', function(req, res) {
    const taskObj = req.body
    console.log(taskObj.task)

    res.send({savedTask: taskObj.task})
})

app.listen(3000, function () { 
    console.log('Example app listening on port 3000!')
})
