const express = require('express');
const { verify } = require('jsonwebtoken');

const router = express.Router();
const userModel = require('../models/User');
const verifytoken = require('../tokenVerify')

router.get("/getall",async (req,res)=>{
    try{
        let users= await userModel.find();
        res.send(users);
    }catch(ex){
        return res.status(500).send("error",ex.message);
    }
    
});

router.post('/add',async (req,res) => {
     
    let userData = new userModel({
        name:req.body.name,
        catID:req.body.catID,
        imageURL:req.body.imageURL,
        uPrice:req.body.uPrice,
        description:req.body.description,
        status:req.body.status,
        discount:req.body.discount,
        videoLink:req.body.videoLink
    })

   try{
    userData = await userData.save();
    
   res.json(userData);
   } catch(err) {

       res.json({message: err});
   }


   
});

router.put("/:id",async (req,res)=>{
    let reqID=req.params.id
    try{
    let user= await userModel.findByIdAndUpdate(reqID,{
        IsAdmin:req.body.IsAdmin,
        
    });

    if(!user){
        return res.status(404).send("no such User")
    }
    
    return res.send("User updated successfully");
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
});

router.get("/find",async(req,res)=>{
    
    let reqID=req.body.id
    try{
    let user=userModel.find({_id: reqID});
    
    if(!user){
        return res.status(404).json("No such User")
    }
    res.json(user)
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
  
});

router.delete("/:id",async(req,res)=>{
    let reqID=req.params.id
    try{
    let user=await userModel.findByIdAndDelete(reqID);
    if(!user){
        return res.status(404).send("no such User")
    }
   

    res.send(user);
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
});


module.exports = router