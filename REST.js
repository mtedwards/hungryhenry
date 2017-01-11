
var mysql       = require("mysql");


function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });
    router.post("/feeds",function(req,res){
        var query = "INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)";
        var table = ["feeds","created","start","end","side","user_id",req.body.created,req.body.start,req.body.end,req.body.side,req.body.user_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Recorded!"});
            }
        });
    });
}

module.exports = REST_ROUTER;
