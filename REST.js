
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
    router.get("/recentfeeds",function(req,res){
        var query = "SELECT * FROM ?? order by start desc limit 8";
        var table = ["feeds"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "feeds" : rows});
            }
        });
    });
    router.get("/feeds",function(req,res){
        var query = "SELECT * FROM ?? order by start desc limit 100";
        var table = ["feeds"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "feeds" : rows});
            }
        });
    });
    router.delete("/feeds/:id",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["feeds","id",req.params.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the feed with id "+req.params.id});
            }
        });
    });
}

module.exports = REST_ROUTER;
