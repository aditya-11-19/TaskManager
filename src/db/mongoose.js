const mongoose=require('mongoose')

//connecting to the database
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true
    // useCreateIndex: true
})






