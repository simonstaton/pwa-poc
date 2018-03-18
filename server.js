'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const keys = require('./vapid-keys');

express()
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  })
  .post('/send-notification', (req, res) => {
    setTimeout(() => {
      webpush.sendNotification(
        req.body.subscription,
        req.body.data.type,
        {
          vapidDetails: {
            subject: 'mailto: simon.staton@bynd.com',
            publicKey: keys.public,
            privateKey: keys.private
          },
          TTL: 60 * 60
        }
      );
    }, req.body.data.timer || 0);
    res.send(true);
  })
  .listen(process.env.PORT || '8081', () => {
    console.log('notification service listening on port 8081');
  });
