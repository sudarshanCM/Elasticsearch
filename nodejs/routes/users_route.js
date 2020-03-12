const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();
const model = require("../models");


app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

class UserRoutes {
  constructor(userController) {
    this.controller = userController;
    this.init();
  }

  init() {
    router.use("/", async (req, res, next) => {
      console.log(req.path);
      next();
      return;
    });

    router.post("/getAll", async (req, res) => {
        try {
          const data = req.fields;
          console.log("HJHK",data.searchTerm);
          const response = await this.controller.getAll(data);
  
          // console.log("Hey",JSON.stringify(response.dates[0]));
          // console.log("Hey",response); 
          res.send(JSON.stringify(response));
        } catch (err) {
          console.log(err);
          res.json({
            status: "error",
            message: err
          });
        }
      });

      router.get("/getHistories", async (req, res) => {
        try {
        //  console.log("IN");
          const response = await this.controller.getHistories();
          
          // console.log("Hey",JSON.stringify(response.dates[0]));
          // console.log("Hey",JSON.stringify(response));
          res.send(JSON.stringify(response));
        } catch (err) {
          console.log(err);
          res.json({
            status: "error",
            message: err
          });
        }
      });

      router.get("/getAllData", async (req, res) => {
        try {
        //  console.log("IN");
          const response = await this.controller.getAllData();
          
          // console.log("Hey",JSON.stringify(response.dates[0]));
          // console.log("Hey",JSON.stringify(response));
          res.send(JSON.stringify(response));
        } catch (err) {
          console.log(err);
          res.json({
            status: "error",
            message: err
          });
        }
      });


      router.post("/aggregate", async (req, res) => {
        try {
        //  console.log("IN");
        
        const data = req.fields

        // console.log(data);
          const response = await this.controller.aggregate(data);
  
          // console.log("Hey",JSON.stringify(response.dates[0]));
          // console.log("Hey",JSON.stringify(response));
          res.send(JSON.stringify(response));
        } catch (err) {
          console.log(err);
          res.json({
            status: "error",
            message: err
          });
        }
      });



      router.post("/search", async (req, res) => {
        try {
          const data = req.fields;
          console.log("HJHK",data.searchTerm);
          const response = await this.controller.search(data);
  
          // console.log("Hey",JSON.stringify(response.dates[0]));
          // console.log("Hey",response.res);
          if(data.searchValue!="null"){
          res.send(JSON.stringify(response.res));
          }
          else{
            res.send(JSON.stringify(response));
          }
        } catch (err) {
          console.log(err);
          res.json({
            status: "error",
            message: err
          });
        }
      });

      router.post("/scroll", async (req, res) => {
        try {
          const data = req.fields;
          // console.log("HJHK",data.searchTerm);
          const response = await this.controller.scroll(data);
  
          // console.log("Hey",JSON.stringify(response.dates[0]));
          // console.log("Hey",JSON.stringify(response.response));
          res.send(JSON.stringify(response.response));
        } catch (err) {
          console.log(err);
          res.json({
            status: "error",
            message: err
          });
        }
      });




} //endofinit

getRouter() {
  return router;
}
} //endofclass

module.exports = controller => {
return new UserRoutes(controller);
};