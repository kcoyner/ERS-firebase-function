const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendMessage = functions.database
  .ref('/test_dispatches/{pushId}')
  .onCreate(event => {
    //dispatchObj
    const dispatchObj = event.data.val();
    console.log('dispatchObj', dispatchObj);

    // push id
    const pushID = event.params.pushId;
    console.log('event.params.pushId', event.params.pushId);

    // TWILIO
    const TWILIO_PHONE_NUMBER = +18055902198;
    const masato_phone_number = functions.config().ers.masato;
    const twilio_account_sid = functions.config().ers.twilio_account_sid;
    const twilio_auth_token = functions.config().ers.twilio_auth_token;
    //require the Twilio module and create a REST client
    var client = require('twilio')(twilio_account_sid, twilio_auth_token);
    client.messages.create(
      {
        from: TWILIO_PHONE_NUMBER,
        to: masato_phone_number,
        body: dispatchObj
      },
      function(err, message) {
        console.log(err, message);
      }
    );
  });
