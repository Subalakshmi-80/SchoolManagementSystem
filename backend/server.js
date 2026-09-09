const express = require("express");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());



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




app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})

