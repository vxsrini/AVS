'use strict';

var express = require('express');
var simpleOauthModule = require('./../');
var uuidv4 = require('uuid/v4');
var recognize = require('./recognize');
var record = require('./record');
var aToken = "";
var app = express();
var fs = require('fs');

const oauth2 = simpleOauthModule.create({
  client: {
    id: 'amzn1.application-oa2-client.ed7a25fc4e0348d6a2523816d9411807',
    secret: '4994f6ee35ee7f164f9b7077986cf45f3ea1302da34d0260f90acd2376fb3ec5',
  },
  auth: {
    tokenHost: 'https://api.amazon.com',
    tokenPath: '/auth/o2/token',
    authorizePath: 'https://amazon.com/ap/oa',
  },
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/authresponse',
  scope: 'alexa:all',
  state: uuidv4(),
  'alexa:all': '{productID:"SriniLinuxTest", productInstanceAttributes:{deviceSerialNumber:"123456"}}'
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  var productScope = { productID: "SriniLinuxTest", productInstanceAttributes: { deviceSerialNumber: "12345" } };
  var scopeData = {};
  scopeData['alexa:all'] = productScope;

  var scopeDataStr = '&scope_data=' + encodeURIComponent(JSON.stringify(scopeData));

  res.redirect(authorizationUri + scopeDataStr);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/authresponse', (req, res) => {
  var code = req.query.code;
  var options = {
    code: code,
    redirect_uri: 'http://localhost:3000/authresponse',
    grant_type: 'authorization_code',
    client_id: 'amzn1.application-oa2-client.ed7a25fc4e0348d6a2523816d9411807',
    client_secret: '4994f6ee35ee7f164f9b7077986cf45f3ea1302da34d0260f90acd2376fb3ec5',

  };

  console.log(code);

  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);
    console.log('The access token is : ', result.access_token);
    

    aToken = result.access_token;
    return res
      .status(200)
      .json(token);
  });
});

app.get('/success', (req, res) => {
  res.send('');
});


app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with amazon</a>');
});

app.get('/getAndPrint', (req, res) => {
  //res.send('Hello<br><a href="/auth">Log in with amazon</a>');
  console.log("REQEST BEGIN <<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log(JSON.stringify(req));
  console.log("REQEST END <<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

});

app.get('/invoke', (req, res) => {
  //console.log('The value of recognize is ', recognize);
  //console.log('The value of record is ', record);
  //console.log("The value of aToken = [" + aToken + "]");
  record.recordWavV1();
  recognize.invoke(aToken);
});

app.get('/record', (req, res) => {
  record.recordWavV1();
  //record.recordWavMS();
});

/*app.get('/play', (req, res) => {
  var rStream = fs.createReadStream('./response_1.wav');

});*/



app.listen(3000, () => {
  console.log('Express server started on port 3000'); // eslint-disable-line
});



// Credits to [@lazybean](https://github.com/lazybean)
