const model = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const elasticSearch = require("elasticsearch");
const https = require("https");
const axios = require("axios");
const moment = require("moment");
// import "core-js/fn/array/flat-map";
var flatMap = require("lodash.flatmap");
var _ = require("lodash");

var client = new elasticSearch.Client({
  host: "localhost:9200"
});

class UserController {
  async getHistories() {
    return new Promise((resolve, reject) => {
      model.History.findAll()
        .then(res => {
          resolve({ res });
        })
        .catch(err => {
          reject({ err });
        });
    });
  }

  async getAllData(){
    return new Promise((resolve,reject)=>{
      var arr=[];
      model.History.findAll().then(res=>{
        for(var i=0;i<res.length;i++){

          client.search(
            {
              index: "moneycontrol",
  
              body: {
                query: {
                  match: { searchTerm: res[i].dataValues.searchTerm }
                }
              }
            },
            function(error, response, status) {
              if (error) {
                console.log("search error: " + error);
              } else {
                // console.log("--- Response ---");
                // console.log(response.hits.hits[1]._source.date);
                var dates = [];
                var volumes = [];
                var open = [];
                var close = [];
                var high = [];
                var low = [];
                
                for (var i = 0; i < response.hits.hits.length; i++) {
                  dates.push(response.hits.hits[i]._source.date);
                  volumes.push(response.hits.hits[i]._source.volume);
                  open.push(response.hits.hits[i]._source.open);
                  high.push(response.hits.hits[i]._source.high);
                  close.push(response.hits.hits[i]._source.close);
                  low.push(response.hits.hits[i]._source.low);
                }
                // console.log(response.hits.hits[0]._source.searchTerm)
                var obj={
                  dates:dates,
                  volumes:volumes,
                  searchTerm:response.hits.hits[0]._source.searchTerm

                }
                
                arr.push(obj);
                console.log("as",arr);
                // console.log("vol",volumes)
                if(res.length==arr.length)
                resolve({ arr});
  
                // console.log("--- Hits ---");
                // response.hits.hits.forEach(function(hit){
                //   console.log(hit);
                // })
              }
            }
          );

        }
      })
    })
  }

  async aggregate(data) {
    return new Promise((resolve, reject) => {
      model.History.findAll().then(res => {
        // console.log(res[0].dataValues.searchTerm);
        if(data.value=='null'){
        var arr = [];
        var i;
        var count=0;
        // for(var i=0;i<res.length;i++){
        // arr.push(res[i].dataValues.searchTerm);

        // var current = res[i].dataValues.searchTerm
        // console.log("term",res[1].dataValues.searchTerm);
        for(i=0;i<res.length;i++){
          console.log("s",res[i].dataValues.searchTerm)
          var term = res[i].dataValues.searchTerm
          
          
        client.search(
          {
            index: "moneycontrol",

            body: {

              aggs:{
                volume:{
                  filter:{match:{"searchTerm":res[i].dataValues.searchTerm}},
                  // aggs:{
                  //   vol:{
                  //   range:{
                  //     field:"date",
                  //     ranges:[
                  //       {from:"2018-08-15T00:00:00Z",to:"2019-08-15T00:00:00Z"}
                  //     ]
                  //   },
                 

                  
                 
                  aggs:{
                    avg_volume:{"avg":{"field":"volume_edited"}}
                  }
              //   }
              // }
                }
              }
              // query: {
              //   match: { searchTerm: "IOC" }
              // },
              // filter: { term: { type: "t-shirt" } }
              // aggs: {
              //   volume: {
              // filter: { term: { searchTerm: "IOC" } },
              // aggs: {
              //   average: { avg: { field: "volume_edited" } }
              // }\
              // filter: {
              //   term: { searchTerm: "IOC" }
              // avg: { field: "volume_edited" }
              // }

              // filter: [
              //   {
              //     // { "term":  { "searchTerm": "IOC" },
              //     average: { avg: { field: "volume_edited" } }
              //   }
              // ]
              //   }
              // }
              // query: {
              //   match: { "searchTerm": data.searchTerm }
              // },
            }
          
          }
        ,
          function(error, response, status) {
            if (error) {
              console.log("search error: " + error);
            } else {
              console.log("--- Response ---");
              // console.log("avg", response.aggregations.volume.vol.buckets[0].avg_volume.value);
              console.log("term"+count, res[count].dataValues.searchTerm);

              var obj={
                searchTerm:res[count].dataValues.searchTerm,
                averageVolume:response.aggregations.volume.avg_volume.value
              }
              if(count<res.length){
                count = count+1;
              }
              // console.log("C",count)
              arr.push( obj)
              // console.log("avg", arr);
              // console.log("da",res[count].dataValues)
              // var res=response.hits.hits;
              if(arr.length==res.length)
              resolve({arr})
              // var dates=[];
              // var volumes=[];
              // for(var i=0;i<response.hits.hits.length;i++){
              //   dates.push(response.hits.hits[i]._source.date)
              //   volumes.push(response.hits.hits[i]._source.volume)
              // }
              // resolve({dates,volumes})

              // console.log("--- Hits ---");
              // response.hits.hits.forEach(function(hit){
              //   console.log(hit);
              // })
            }
          }
        );
        }//end of for
        // }//for
        // console.log(arr[1]);
        }
        else{
          if(data.value=='5'){
            var d = new Date();
         var n = new Date();
         d.setMonth(d.getMonth()-60);
            var fromDate = d.toISOString();
            var toDate = n.toISOString();
            }
          else{
            var d = new Date();
            var n = new Date();
            d.setMonth(d.getMonth()-120);
               var fromDate = d.toISOString();
               var toDate = n.toISOString();
          }

          var arr = [];
        var i;
        var count=0;
        for(i=0;i<res.length;i++){
          console.log(res[i].dataValues.searchTerm)
        client.search(
          {
            index: "moneycontrol",

            body: {

              aggs:{
                volume:{
                  filter:{match:{"searchTerm":res[i].dataValues.searchTerm}},
                  aggs:{
                    vol:{
                    range:{
                      field:"date",
                      ranges:[
                        {from:fromDate,to:toDate}
                      ]
                    },
                 

                  
                 
                  aggs:{
                    avg_volume:{"avg":{"field":"volume_edited"}}
                  }
                }
              }
                }
              }
             
            }
          
          }
        ,
          function(error, response, status) {
            if (error) {
              console.log("search error: " + error);
            } else {
              console.log("--- Response ---");
              // console.log("avg", response.aggregations.volume.vol.buckets[0].avg_volume.value);
              // console.log("res", response.aggregations.volume.vol.buckets);
              // console.log("term"+count, response.aggregations.volume.vol.buckets[0]);
              console.log(response.aggregations.volume.vol);
              var obj={
                searchTerm:res[count].dataValues.searchTerm,
                averageVolume:response.aggregations.volume.vol.buckets[0].avg_volume.value
              }
              if(count<res.length){
                count = count+1;
                
              }
              // console.log("C",count)
              arr.push(obj)
              console.log("avgyes", arr);
              // console.log("da",res[count].dataValues)
              // var res=response.hits.hits;
              if(arr.length==res.length)
              resolve({arr})
              // var dates=[];
              // var volumes=[];
              // for(var i=0;i<response.hits.hits.length;i++){
              //   dates.push(response.hits.hits[i]._source.date)
              //   volumes.push(response.hits.hits[i]._source.volume)
              // }
              // resolve({dates,volumes})

              // console.log("--- Hits ---");
              // response.hits.hits.forEach(function(hit){
              //   console.log(hit);
              // })
            }
          }
        );
        }//end of for

        }//end of else
      });
      
    });
  
  }

  async scroll(data) {
    return new Promise((resolve, reject) => {
      client.search(
        {
          index: "moneycontrol",

          body: {
            from: data.length,
            size: "20",
            query: {
              match: { searchTerm: data.searchTerm }
            }
          }
        },
        function(error, response, status) {
          if (error) {
            console.log("search error: " + error);
          } else {
            // console.log("--- Response ---");
            // console.log(response.hits.hits[1]._source.date);
            var response = response.hits.hits;

            resolve({ response });

            // console.log("--- Hits ---");
            // response.hits.hits.forEach(function(hit){
            //   console.log(hit);
            // })
          }
        }
      );
    });
  }

  async search(data) {
    return new Promise((resolve, reject) => {
      if (data.searchValue == "null") {
        client.search(
          {
            index: "moneycontrol",

            body: {
              query: {
                match: { searchTerm: data.searchTerm }
              }
            }
          },
          function(error, response, status) {
            if (error) {
              console.log("search error: " + error);
            } else {
              // console.log("--- Response ---");
              // console.log(response.hits.hits[1]._source.date);
              var dates = [];
              var volumes = [];
              var open = [];
              var close = [];
              var high = [];
              var low = [];
              for (var i = 0; i < response.hits.hits.length; i++) {
                dates.push(response.hits.hits[i]._source.date);
                volumes.push(response.hits.hits[i]._source.volume);
                open.push(response.hits.hits[i]._source.open);
                high.push(response.hits.hits[i]._source.high);
                close.push(response.hits.hits[i]._source.close);
                low.push(response.hits.hits[i]._source.low);
              }
              // console.log("vol",volumes)
              resolve({ dates, volumes, open, close, high, low });

              // console.log("--- Hits ---");
              // response.hits.hits.forEach(function(hit){
              //   console.log(hit);
              // })
            }
          }
        );
      } else {
        var high = data.searchValue + 5;
        var low = data.searchValue - 5;
        client.search(
          {
            index: "moneycontrol",

            body: {
              query: {
                bool: {
                  must: [
                    { match: { searchTerm: data.searchTerm } },
                    {
                      range: {
                        value: {
                          gte: low,
                          lte: high
                        }
                      }
                    }
                  ]
                }
              }
              // query: {
              //   match: { "searchTerm": data.searchTerm }
              // },
            }
          },
          function(error, response, status) {
            if (error) {
              console.log("search error: " + error);
            } else {
              console.log("--- Response ---");
              // console.log(response.hits.hits);
              var res = response.hits.hits;
              resolve({ res });
              // var dates=[];
              // var volumes=[];
              // for(var i=0;i<response.hits.hits.length;i++){
              //   dates.push(response.hits.hits[i]._source.date)
              //   volumes.push(response.hits.hits[i]._source.volume)
              // }
              // resolve({dates,volumes})

              // console.log("--- Hits ---");
              // response.hits.hits.forEach(function(hit){
              //   console.log(hit);
              // })
            }
          }
        );
      }
    });
  }

  async getAll(data) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          "https://www.moneycontrol.com/mc/widget/basicchart/get_chart_value?classic=true&sc_did=" +
            data.searchTerm +
            "&dur=max"
        )
        .then(response => {
          for (var i = 0; i < response.data.g1.length; i++) {
            response.data.g1[i]["searchTerm"] = data.searchTerm;
          }
          // console.log(response.data.g1[0]);

          // const history = model.History.create({ searchTerm: data.searchTerm });

          model.History.findOne({
            where: { searchTerm: data.searchTerm }
          })
            .then(res => {
              // console.log("HET");
              if (!res) {
                model.Data.bulkCreate(response.data.g1)
                  .then(res => {
                    model.History.create({ searchTerm: data.searchTerm })
                      .then(res => {
                        // console.log("Success")
                        const body = _.flatMap(response.data.g1, doc => [
                          { index: { _index: "moneycontrol" } },
                          doc
                        ]);
                        const { body: bulkResponse } = client.bulk({
                          refresh: true,
                          body
                        });

                        if (bulkResponse.errors) {
                          const erroredDocuments = [];

                          bulkResponse.items.forEach((action, i) => {
                            const operation = Object.keys(action)[0];
                            if (action[operation].error) {
                              erroredDocuments.push({
                                status: action[operation].status,
                                error: action[operation].error,
                                operation: body[i * 2],
                                document: body[i * 2 + 1]
                              });
                            }
                          });
                          console.log(erroredDocuments);
                        }
                        resolve({ code: "200", message: "Success" });
                      })
                      .catch(err => {
                        reject({ code: "400", message: err });
                      });
                  })
                  .catch(err => {
                    reject({ code: "400", message: err });
                  });
              } else {
                resolve({ code: "200", message: "Data Already exist" });
                // console.log("else");

                //Working
                // client.search({
                //   index: 'moneycontrol',

                //   body: {
                //     query: {
                //       match: { "searchTerm": data.searchTerm }
                //     },
                //   }
                // },function (error, response,status) {
                //     if (error){
                //       console.log("search error: "+error)
                //     }
                //     else {
                //       // console.log("--- Response ---");
                //       // console.log(response.hits.hits[1]._source.date);
                //       var dates=[];
                //       var volumes=[];
                //       for(var i=0;i<response.hits.hits.length;i++){
                //         dates.push(response.hits.hits[i]._source.date)
                //         volumes.push(response.hits.hits[i]._source.volume)
                //       }
                //       resolve({dates,volumes})

                //       // console.log("--- Hits ---");
                //       // response.hits.hits.forEach(function(hit){
                //       //   console.log(hit);
                //       // })
                //     }
                // });
              }
            })
            .catch(err => {
              // console.log("errr");
              reject({ code: "400", message: err });
            });

          //   console.log(response.data.explanation);g
          // const dataset = response.data.g1

          // const body = response.data.g1.flatMap(doc => [{ index: { _index: 'moneycontrol' } }, doc])

          //Working

          // const body = _.flatMap(response.data.g1,doc => [{ index: { _index: 'moneycontrol' } }, doc])
          //   const { body: bulkResponse } = client.bulk({ refresh: true, body })

          //   if (bulkResponse.errors) {
          //     const erroredDocuments = []
          //     // The items array has the same order of the dataset we just indexed.
          //     // The presence of the `error` key indicates that the operation
          //     // that we did for the document has failed.
          //     bulkResponse.items.forEach((action, i) => {
          //       const operation = Object.keys(action)[0]
          //       if (action[operation].error) {
          //         erroredDocuments.push({
          //           // If the status is 429 it means that you can retry the document,
          //           // otherwise it's very likely a mapping error, and you should
          //           // fix the document before to try it again.
          //           status: action[operation].status,
          //           error: action[operation].error,
          //           operation: body[i * 2],
          //           document: body[i * 2 + 1]
          //         })
          //       }
          //     })
          //     console.log(erroredDocuments)
          //   }

          //   const { body: count } = client.count({ index: 'tweets' })
          //   console.log(count)
        })
        .catch(error => {
          console.log(error);
        });

      // client.index({
      //     index:'sample',
      //     type:'_doc',
      //     id:data.id,
      //     body: {
      //         "PostName": "Integrating Elasticsearch Into Your Node.js Application",
      //         "PostType": "Tutorial",
      //         "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application.",
      //     }
      // },function(err,response,status){
      //     if(err){
      //         reject({code:400,message:err});
      //     }
      //     else{
      //         resolve({code:200,message:"Success"});
      //     }
      // })
    });
  }
}

module.exports = db => {
  return new UserController(db);
};
