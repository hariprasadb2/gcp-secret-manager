'use strict';

const express = require('express');
var os = require('os');
var mysql = require('mysql');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
var responsePayload
var con
const client = new SecretManagerServiceClient();
// Constants
const PORT = 3000;
const HOST = '0.0.0.0';


(async function createAndAccessSecret() {
//const name ='projects/327717976330/secrets/sql-cred/versions/3' change :



const [accessResponse] = await client.accessSecretVersion({
    name: name
  });

  responsePayload = accessResponse.payload.data.toString('utf8');
  console.info(`Payload: ${responsePayload}`);

  var user = JSON.parse(responsePayload).user;
  var password = JSON.parse(responsePayload).password

   var networkInterfaces = os.networkInterfaces();
   con = mysql.createConnection({
                  host: "localhost",
                  user: user,
                  password: password
});


})();


// App
const app = express();
app.get('/', (req, res) => {
  console.log(con)
  con.connect(function(err) {
    if (err) throw err;
   con.query("SELECT * FROM testDB.Persons", function (err, result, fields) {
                                                                       if (err) throw err;
                                                                       console.log(result);
                                                                       res.send(result)
                                                                     });


  });

});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);