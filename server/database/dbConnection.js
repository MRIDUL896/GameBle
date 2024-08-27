const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const dbURL = process.env.DB_URL;

const dbConnection =  async () => {
    try{
        await mongoose.connect(dbURL).then(() => {
            console.log("connected to mongodb");
        }).catch((err) => {
            console.log("err",err);
        })
    }catch(err){
        res.json({"message" : err});
    }
};

module.exports = dbConnection;