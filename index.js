'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('sample', (conv, {bee}) => {
    const luckyNumber = bee.length;
    // Respond with the user's lucky number and end the conversation.
    conv.close('Your lucky number is ' + luckyNumber);
});

//Intent for help
app.intent('help', (conv, {check_item}) => {
    console.log("ERROR CHECK"+check_item);
    // Respond with items
    
  
  //Cloud vision
  const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.v1.ImageAnnotatorClient({});
var labels = '';
  var new_label = "no";
// Performs label detection on the image file
client
  .labelDetection('https://healthydebate.ca/wp-content/uploads/2017/04/Essential-Medicines_cropped-1.jpg')
  .then(results => {
     labels = results[0].labelAnnotations;
  labels.forEach(label => {console.log(label.description);
                            if(label.description.toLowerCase()==check_item.toLowerCase()){
                            new_label = "yes";
                            }
                            });
    console.log('Labels:');
    
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
  return new Promise(resolve => setTimeout(() => resolve(), 3500))
    .then(() => {
    if(new_label=="yes"){
    conv.ask(new_label+", it is present.");
    }
    else{
    conv.ask(new_label+",I can't find it");}
    
    });
});
  
  //intent to get medicine
  // The intent collects a parameter named 'color'.
app.intent('get_med', (conv, {number}) => {
    const num = number;
    //Send request
    const dgram = require('dgram');
const message = Buffer.from('check '+num);
const client = dgram.createSocket('udp4');
client.send(message, 8005, '24.62.207.233', (err) => {
  client.close();
  console.log('client sending');
  
});
});
  //End
  

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);