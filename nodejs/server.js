const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const Sequelize = require("sequelize");
var http_port = 3007;
var formidable = require("express-formidable");
const model = require("./models");



var seq = new Sequelize("ElasticSearch", "root", "root", {
  host: "localhost",
  port: "3306",
  dialect: "mysql",
  opertorsAliases: false,
});

class App {
  constructor() {
    this.init();
  }

  init() {
    this.initdb();
  }
  initdb() {
    seq
      .authenticate()
      .then((req, res, next) => {
        console.log("Connection has been established successfully.");
        this.initHTTPServer();
        this.initControllers();
        this.initRoutes();
      })
      .catch(error => {
        console.error("Unable to connect to the database:", error);
      });
  }
  initHTTPServer() {
    app.use(formidable());
    app.use(cors());
    app.listen(http_port, function() {
      console.log("Listening on port" + " " + http_port);
    });
    
  }
  initControllers() {
    this.userController = require("./Controllers/user_controller.js")();
  }

  initRoutes() {
    const userRoute = require("./routes/users_route.js")(this.userController);

    
    app.use("/user", userRoute.getRouter());

  }
}

const AppObj = new App();
