const express=require('express')
require('./db/mongoose') //only requuire mongoose.js to run the command and connect the database
var cors = require('cors')

const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const app=express()
const port=process.env.PORT  // process.env.PORT || 3000 , means: whatever is in the environment variable PORT, or 3000 if there's nothing there.

//without express middleware: new request -> run route handler
//with express middleware: new request -> do something -> run route handler
// app.use((req,res,next)=>{
//     req.send("Indisde middleware")
//     next() 
       //to tell axpress we are done with this middleware function
// })

// If you set your site for maintainenece
// app.use((req,res,next)=>{
//     res.status(503).send("Site is currently under maintainence")
//     //next() 
//     //don't use next() to tell express not move forward to any route handler
// })
app.use(cors());
const multer=require('multer')

const upload= multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter (req , file, cb ){
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("please upload docx"))

        }
        cb(undefined,true)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})




app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log("server is up on "+port)
} ) 




// To host database:  C:/users/schau/mongodb/bin/mongod.exe --dbpath=C:/users/schau/mongodb-data

