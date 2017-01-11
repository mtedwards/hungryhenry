var express     = require("express");
var path        = require('path');
var mysql       = require("mysql");
var bodyParser  = require("body-parser");
var md5         = require("MD5");
var rest        = require("./REST.js");
var app         = express();
app.use(express.static(__dirname, 'build'));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);

function REST(){
  var self = this;
  self.connectMysql();
};

REST.prototype.connectMysql = function() {
  var self = this;
  var pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'feedhenry',
       socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
       debug     : false
  });
  pool.getConnection(function(err,connection){
    if(err){
      self.stop(err);
    } else {
      self.configureExpress(connection);
    }
  });
};

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection,md5);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();
