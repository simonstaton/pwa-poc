'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const keys = require('./vapid-keys');

express()
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })
  .post('/send-notification', (req, res) => {
    webpush.sendNotification(
      req.body.subscription,
      req.body.data,
      {
        vapidDetails: {
          subject: 'mailto: simon.staton@bynd.com', // Change this to the actual url application at some point
          publicKey: keys.public,
          privateKey: keys.private
        },
        TTL: 60 * 60
      }
    )
    .then(() => {
      res.status(200).send({success: true});
    })
    .catch((err) => {
      if (err.statusCode) {
        res.status(err.statusCode).send(err.body);
      } else {
        res.status(400).send(err.message);
      }
    });
  })
  .listen(process.env.PORT || '8886', () => {
    console.log('notification service listening on port 8886');
  }); // Need somewhere to host
