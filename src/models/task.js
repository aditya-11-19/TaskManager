const mongoose=require('mongoose')
const validator=require('validator')

const taskSchema=new mongoose.Schema({
    description: {
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type: Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }

},{
    timestamps:true
})

// taskSchema.pre('save', async function (next){ //pre() and post() for actions before and after event occurred & "arrow function" not used becz can't bind "this" keyword
//     const task=this
//     console.log('task')
//     next()
// })   

const Task=mongoose.model('Task',taskSchema)



module.exports=Task