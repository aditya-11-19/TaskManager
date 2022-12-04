const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        default:"Anonymous",
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowecase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Invalid password")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Age must be positive number")
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true            
        }    
    }],
    avatar:{
        type: Buffer
    }

},{
    timestamps:true
})

//virtual property not actual data stored in database but relation between 2 entities
//Not actually changing data but telling mongoose how 2 entities are related
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',      // name of field where local data is stored
    foreignField:'owner'  //name of the field on the other entity
})

//-> when call res.send() , JSON.stringify() gets called automatically 
//  toJSON is called every time JSON.stringify() is called and we can assign toJSON equal to a function() and perform any task accordingly 
//-> we are deleting the items from response so that only specific data is send back and not slows down the apps speed
userSchema.methods.toJSON = function (){
    const user =this
    const userObject= user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// when we have an instance of a particular user we would use userSchema.methods and use simple functions not an arrow func becz we need this keyword 
// methods can be accesible on the instance of user 
userSchema.methods.generateAuthToken= async function (){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens=user.tokens.concat({token})

    await user.save() 
    return token
}

// static methods are accecible on the model
userSchema.statics.findByCredentials = async (email,password)=>{
    
    const user = await User.findOne({email})

    if(!user){
        
        throw new Error('Unable to login')
    }

    const isMatch= await bcrypt.compare(password,user.password)

    if(!isMatch){
        
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next){ //pre() and post() for actions before and after event occurred & "arrow function" not used becz can't bind "this" keyword
    const user=this
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }
    next()
})   

userSchema.pre('remove', async function (next){
    const user=this
    await Task.deleteMany({owener: user._id})
    next()
})


const User=mongoose.model('User',userSchema)

module.exports= User