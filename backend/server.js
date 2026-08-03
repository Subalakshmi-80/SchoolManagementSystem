const express = require("express");
require("dotenv").config();
const pool = require("./db/db");



const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const runMigration = require("./migrations/runMigration");
app.use(cors());

// database connection

async function connectDB(){
      try{
        await pool.query("SELECT NOW()");
        console.log("Database connected successfully");
      }catch(err){
        console.log("Database connection Failed",err.stack);
    }
}

connectDB();

app.use(express.json());

app.use("/api",require("./routes/authRoutes")); //login
app.use("/api",require("./routes/studentRoutes")); //students CRUD
app.use("/api",require("./routes/teacherRoutes")); //Teacher CRUD
app.use("/api",require("./routes/standardRoute")); //Standard CRUD
app.use("/api",require("./routes/classesRoute"));  //class CRUD
app.use("/api",require("./routes/subjectRoutes"));  //Subject CRUD


app.use("/api",require("./routes/forgotPasswordRoutes"));  //forgot password routes

app.use("/api",require("./routes/testRoutes")) //test and Marks routes
app.use("/api",require("./routes/timetableRoutes"))  //TimeTable Routes


async function startServer() {
  try{
    await runMigration();

    app.listen(PORT,()=>{
      console.log(`Server is running on port ${PORT}`)
    })
  }catch(err){

      console.error("Application startup failed.");
      console.error(err)
  }
  
}

startServer()
