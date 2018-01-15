// # firebase function cli commands for env variables
// firebase functions:config:get
// firebase functions:config:set ers.objectKey=objectValue
// functions.config().ers.objectKey --> objectValue

// # firebase function cli commands for deploy
// firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendMessage = functions.database
  .ref('/gfdDispatches/{pushId}')
  .onCreate(event => {
    // # not using below for now to respect 160 character limit
    // // dispatchObj
    // const dispatchObj = event.data.val();
    // console.log('dispatchObj', dispatchObj);

    // get pushed id
    const pushID = event.params.pushId;
    console.log('event.params.pushId', event.params.pushId);

    // -- start twilio SMS text sending code --
    // twilio access info
    const twilio_account_sid = functions.config().ers.twilio_account_sid;
    const twilio_auth_token = functions.config().ers.twilio_auth_token;
    // twilio phone number
    const TWILIO_PHONE_NUMBER = +18055902198;
    // member's phone number
    const masato_phone_number = functions.config().ers.masato;
    const kevin_phone_number = functions.config().ers.kevin;
    const nick_phone_number = functions.config().ers.nick;
    const max_phone_number = functions.config().ers.max;
    const phoneNumbers = [
      masato_phone_number,
      kevin_phone_number
    ];

    //require the Twilio module and create a REST client
    const client = require('twilio')(twilio_account_sid, twilio_auth_token);
    const sms_message = `https://ers-dispatch.firebaseapp.com/?id=${pushID}`;
    for (let phoneNumber of phoneNumbers) {
      client.messages.create(
        {
          from: TWILIO_PHONE_NUMBER,
          to: phoneNumber,
          body: sms_message
        },
        function(err, message) {
          console.log(err, message);
        }
      );
    }
  });
