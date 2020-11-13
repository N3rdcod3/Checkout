//we are importing the library called express from node_modules folder
const express = require("express"); 
const path = require("path");      
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const app = express(); //create instance for express
 
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Parse cookie bodies, and allow setting/getting cookies
app.use(cookieParser());
 
app.use(express.static(path.join(__dirname, "/public"))); //remove restriction, so that they can be accessed from the web browser
 
// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config();
config.apiKey = "AQEyhmfxLI3MaBFLw0m/n3Q5qf3VaY9UCJ14XWZE03G/k2NFitRvbe4N1XqH1eHaH2AksaEQwV1bDb7kfNy1WIxIIkxgBw==-y3qzswmlmALhxaVPNjYf74bqPotG12HroatrKA066yE=-W+t7NF;s4}%=kUSD";

config.merchantAccount = "AdyenRecruitmentCOM" ;

config.clientKey = "test_CIXAPNBW2JERLEJ6GYYC3WBLVMO2HIZ3" ;

const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);
 
// Use Handlebars as the view engine
app.set("view engine", "handlebars");
 
// Specify where to find view files
app.engine(
  "handlebars",
  hbs({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
  })
);


app.use(express.static(path.join("static")));
app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});

//When our page is displayed it will first run layouts/main.handlebars and then the requested page
app.get('/', (req,res) => {
  //  res.send('Hello World')
  res.render('index'); //loads what we have in index.handlebars 
});


//######## ENDPOINTS #############

app.get("/getPaymentMethods", (req, res) => {
    checkout
      .paymentMethods({
        channel: "Web",
        merchantAccount: config.merchantAccount,
        countryCode: "MX",
        shopperLocale: "es-MX",
        amount: {
        currency: "MXN",
        value: 1000 
        }   
       })
      .then(response => {
        // Adyen API response is passed to the client
        res.render("checkoutbox",{ 
            response:response,
            layout:false      //turn off layout for the result
        });
      });
  });

  app.post("/initatepayment", (req, res) => {
    var d = req.body;
    checkout.payments({
        "amount": {
          "currency": "MXN",
          "value": 150
        },
        "reference": "ANJAN123",
        "paymentMethod": {
          "type": d.type ,
          "number": d.number,
          "expiryMonth": d.expiryMonth,
          "expiryYear": "20" + d.expiryYear,
          "holderName": "John Smith",
          "cvc": d.cvc
        },
        "additionalData": {
          "allow3DS2": true
        },
        "accountInfo": {
          "accountCreationDate": "2019-01-17T13:42:40+01:00"
        },
        "billingAddress": {
          "country": d.country,
          "city": d.city,
          "street": d.street,
          "houseNumberOrName": d.houseNumberOrName,
          "stateOrProvince": d.stateOrProvince,
          "postalCode": d.postalCode
        },
        "shopperEmail": d.shopperEmail,
        "shopperIP": "192.0.2.1",
        "browserInfo": {
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36",
          "acceptHeader": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "language": "nl-NL",
          "colorDepth": 24,
          "screenHeight": 723,
          "screenWidth": 1536,
          "timeZoneOffset": 0,
          "javaEnabled": true
        },
        "channel": "web",
        "origin": "https://shamir.com",
        "returnUrl": "https://shamir/checkout/",
        "merchantAccount": config.merchantAccount
    }).then(response => {
      // Adyen API response is passed to the client
      res.render(response);
    });; 
});
  
  