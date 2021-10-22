const express = require('express');
const { verify } = require('jsonwebtoken');

const router = express.Router();
const categoryModel = require('../models/category');
const verifytoken = require('../tokenVerify')

router.get("/getall",async (req,res)=>{
    try{
        let categories= await categoryModel.find();
        res.json(categories);
    }catch(ex){
        return res.status(500).send("error",ex.message);
    }
    
});

router.post('/add',async (req,res) => {

    if(!req.body.name)
    {
        return res.status(400).send("name is empty");
    }
    if(!req.body.catId)
    {
        return res.status(400).send("catId is empty");
    }
     
    let categoryData = new categoryModel({
        name:req.body.name,
        catId:req.body.catId,
        description:req.body.description,
        
    })

   try{
    categoryData = await categoryData.save();
    
   res.json(categoryData);
   } catch(err) {

       res.json({message: err});
   }


   
});

router.put("/:id",async (req,res)=>{
    let reqID=req.params.id
    try{
    let item= await categoryModel.findByIdAndUpdate(reqID,{
        name:req.body.name,
        catId:req.body.catId,
        description:req.body.description,
    });

    if(!item){
        return res.status(404).send("no such Category")
    }
    
    return res.send("Category updated successfully");
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
});


router.get("/:id",async(req,res)=>{
    
    let reqID=req.params.id
    try{
    let category=await categoryModel.findById(reqID);
    
    if(!category){
        return res.status(404).send("No such Category")
    }
    res.send(category)
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
  
});

router.delete("/:id",async(req,res)=>{
    let reqID=req.params.id
    try{
    let category=await categoryModel.findByIdAndDelete(reqID);
    if(!category){
        return res.status(404).json("no such item")
    }
    

    res.json(category);
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
});


module.exports = router