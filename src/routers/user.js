const express=require('express')
const User=require('../models/user')
const auth= require('../middleware/auth')
const multer= require('multer')
const sharp = require('sharp')
const router= new express.Router()


router.post('/users',async (req,res)=>{
    const user=new User(req.body)

    try{
        await user.save()
        console.log(user.email)
        console.log(user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})

    }
    catch(e){
        res.status(400).send(e)
    }
   
})

router.post('/users/login' ,async (req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        // console.log(token)
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout' , auth, async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((tokenobj)=>{
            return tokenobj.token!==req.token
        })

        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()fatal: not a git repository (or any of the parent directories): .git
    }
})

//to logout from all sessions
router.post('/users/logoutAll' , auth, async (req,res)=>{
    try{
        req.user.tokens=[]

        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


router.get('/users/me', auth ,async (req,res)=>{
    res.status(200).send(req.user)
})

router.get('/users/:id',async (req,res)=>{
    const _id=req.params.id   //req.params.id will parse what is passed in "id"

    try{
        const user= await User.findById(_id)
        if(!user){
            res.status(404).send()
        }

        res.status(201).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})

router.patch('/users/me', auth, async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=['name','password','email','age']
    const isValidOperation =updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({error:'Invalid Updates'})   
    }

    try{
        // "findByIdAndUpdate" bypasses middleware property->interacts directly to database->to perform middleware authentication use "findById"
        // const user=await User.findByIdAndUpdate(_id, req.body,{new:true, runValidators:true})
        
        // const user=await User.findById(req.user._id)
        updates.forEach((update) => {
            req.user[update]=req.body[update]
        })

        await req.user.save()

        // if(!user){
        //     res.status(404).send()
        // }
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req,res)=>{

    try{
        // const user= await User.findByIdAndDelete(req.user._id)
        // // if(!user){
        // //     res.status(404).send()
        // // }
        req.user.remove()
        // sendCancellationEmail(req.user.email , req.user.name)
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

const upload= multer({
    // dest:'avatars',
    limits:{
        fileSize: 100000000      //in bytes
    },     
    fileFilter(req,file,cb){         //cb -> callback function
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ 
            return cb(new Error('Please upload an image'))
        }

            cb(undefined,true)
    }
})

// multer is processing the data and passing it to our async function 
// because we removed  " dest:'avatars' " from  upload.
// If we add " dest:'avatars' " async func will not get acces to uploaded image.

router.post('/users/me/avatar', auth ,upload.single('avatar'), async (req,res)=>{
    const  buffer=await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer


    await req.user.save()
    res.send()
},(error,req,res,next)=>{
   res.status(400).send({error: error.message}) 
})


router.delete('/users/me/avatar', auth, async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})


router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        
        if(!user || !user.avatar){
            throw new Error()
        }
        // res.set('Content-Type', 'application/json')  Express automatically specify Content-Type to ,application/json when we send back json ->EXPRESS IS SMART!!
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports=router