// app.js 
const sls = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const RANDOMFLIX_TABLE = process.env.RANDOMFLIX_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
app.use(bodyParser.json({ strict: false }));
// Create User endpoint
app.post('/randomFlix', function (req, res) {
  const { videoId, title } = req.body;
const params = {
    TableName: RANDOMFLIX_TABLE,
    Item: {
      videoId: videoId,
      title: title,
    },
  };
dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not create user ${videoId}` });
    }
    res.json({ videoId, title });
  });
})

//Region Get movie endpoint
app.get('/randomFlix/:videoId', function (req, res) {
  const params = {
    TableName: RANDOMFLIX_TABLE,
    Key: {
      videoId: req.params.videoId,
    },
  }
dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not get user ${videoId}` });
    }
    if (result.Item) {
      const {videoId, title} = result.Item;
      res.json({ videoId, title });
    } else {
      res.status(404).json({ error: `User ${videoId} not found` });
    }
  });
})
//endregion

module.exports.server = sls(app)