"use strict";

const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const broker = new ServiceBroker();

let DBName = "" ;
let CollectionName = "" ;
let CollectionFields = {};
class EchoBot {
    async onTurn(context) {
        
        if (context.activity.type === 'message' && context.activity.text) {

            if (context.activity.text.toLowerCase() === 'quit') {
                context.sendActivity('Bye!');
                process.exit();
            } else {
                if(DBName){
                    if(CollectionName){
                        CollectionFields = JSON.parse(context.activity.text);
                        if(typeof CollectionFields == 'object')
                        {   
                            let modelSchema = {} ;
                            console.log("The record entered is : " , CollectionFields );

                            Object.entries(CollectionFields).forEach(([key,value])=>{
                                modelSchema[key] = {type : typeof value}
                            })
                            console.log("The Model Schema is : " , modelSchema);
                            
                            // Create a Mongoose service for `post` entities
                            broker.createService({
                                name: CollectionName,
                                mixins: [DbService],
                                adapter: new MongooseAdapter("mongodb://localhost/moleculer-demo"),
                                model: mongoose.model(CollectionName, mongoose.Schema(
                                    modelSchema
                                    ))
                            });

                            broker.start()
                            // Create a new record
                            .then(() => broker.call(CollectionName + ".create",  CollectionFields ))

                            // Get all records
                            .then(() => broker.call(CollectionName + ".find").then(console.log));
                        }
                        else
                            console.log("Validation Error : Please Enter Json Object of fields for the collection :");
                    }
                    else{
                        CollectionName = context.activity.text ;
                        if(CollectionName)
                        {
                            console.log("Collection Name Is " , CollectionName);
                            return  2; // 1 Collection Name Is Exist
                        }
                    }
                }
                else{
                    DBName = context.activity.text ;
                    if(DBName)
                    {
                        console.log("Database Name Is " , DBName);
                        return  1; // 1 Database Name Is Exist
                    }
                }
                // adapter.listen(async (context) => {
                //     bot.onTurn(context);
                // });
                // return context.sendActivity(`Database Name Is "${ context.activity.text }"`);
            }
        }
    }
}

module.exports = { EchoBot };
