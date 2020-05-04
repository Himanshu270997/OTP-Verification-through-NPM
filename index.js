const express = require('express');
const app = express();
const config = require("./config");
const port = 3000;
const client = require("twilio")(config.accountSID, config.authToken);

app.get('/' , (req , res) => {
    res.status(200).send({
        message: "You are on Homepage",
        info: {
            login: "Send verification code through /login . It contains two params i.e. phonenumber and channel(sms/call)",
            verify: "Verify the recieved code through /verify . It contains two params i.e. phonenumber and code"
        }

    })
});

app.get('/login' , (req,res) =>{
    if (req.query.phonenumber) {
        client 
       .verify
       .services(config.serviceID)
       .verifications
       .create({
         to: `+${req.query.phonenumber}`,
         channel: req.query.channel  })
         .then(data => {
            res.status(200).send({
                message: "Verification is sent!!",
                phonenumber: req.query.phonenumber,
                data
            })
       })
       .then( (data) => {
           res.status(200).send(data)

       }) }
       else {
        res.status(400).send({
            message: "Wrong phone number :(",
            phonenumber: req.query.phonenumber,
            data
        })
    }
    
});
  app.get('/verify', (req, res) =>{
    if (req.query.phonenumber && (req.query.code).length === 6) {
      client 
      .verify 
      .services(config.serviceID)
      .verificationChecks
      .create({
        to: `+${req.query.phonenumber}`,
        code: req.query.code 
        
      })
      .then( (data) => {
          if(data.status == 'approved')
          res.status(200).send({
              message : 'User is verified',
              data})
      })
    }
    else {
        res.status(400).send ({
            message : " Worong number",
            data 
        })
    }
  });
app.listen(port , () => {
    console.log('Hey buddy I am groot');
});
