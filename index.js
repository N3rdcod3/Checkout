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
 
app.use(express.static(path.join(__dirname, "/public")));
 
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
            response:response,layout:false      //turn off layout for the result
        });
      });
  });
  