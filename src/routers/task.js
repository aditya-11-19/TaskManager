const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router= new express.Router()
const multer=require('multer')



const create=multer()
//when we pass data as form-data in postman or from a site we have to use multer it is different for text onle and sending pdf+text
//http://expressjs.com/en/resources/middleware/multer.html
router.post('/tasks',auth,create.none(),async (req,res)=>{
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
        
    } 
    catch(e){
        res.status(400).send(e)
    }
    
})

// GET /tasks?completed=true           FILTERING
// GET /tasks?limit=10 &skip=20        PAGINATING
// GET /tasks?sortBy=createdAt:desc    SORTING

router.get('/tasks', auth, async (req,res)=>{
    const match={}
    const sort={}

    if(req.query.completed){
        match.completed = (req.query.completed==='true')
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]= (parts[1] === 'desc' ? -1 : 1)
    } 

    try{
        // const tasks= await Task.find({owner: req.user._id})
        await req.user.populate({
            path:  'tasks',
            match:match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort:sort
            }
        })
        res.send(req.user.tasks)  
    }
    catch(e){
        res.status(500).send(e)
    }
    
})

router.get('/tasks/:id', auth, async (req,res)=>{
    
    try{
        const task= await Task.findOne({_id:req.params.id, owner: req.user._id})

        if(!task){
            res.status(404).send()
        }
        
        res.status(201).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})

router.patch('/tasks/:id', auth ,async (req,res)=>{
    // const _id=req.params.id
    const updates=Object.keys(req.body)  //updates is an array of keys requested for updation
    const allowedUpdates=['completed','description']
    const isValidOperation =updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({error:'Invalid Updates'})    
    }

    try{
        // "findByIdAndUpdate" bypasses middleware property->interacts directly to database->to perform middleware authentication use "findById"
        // const task=await Task.findByIdAndUpdate(_id, req.body,{new:true, runValidators:true})
        // const task=await Task.findById(_id)

        const task= await Task.findOne({_id:req.params.id, owner: req.user._id})

        if(!task){
            res.status(404).send()
        }
        
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save() 
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth,async (req,res)=>{

    try{
        // const task= await Task.findByIdAndDelete(_id)
        const task= await Task.findOneAndDelete({_id: req.params.id , owner: req.user._id})

        if(!task){
            res.status(404).send()
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports =router