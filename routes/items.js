const express = require('express');
const { verify } = require('jsonwebtoken');

const router = express.Router();
const itemModel = require('../models/item');
const verifytoken = require('../tokenVerify')

router.get("/getall",async (req,res)=>{
    try{
        let items= await itemModel.find();
        res.json(items);
    }catch(ex){
        return res.status(500).json("error",ex.message);
    }
    
});

router.post('/add',async (req,res) => {

    if(!req.body.name)
    {
        return res.status(400).send("name is empty");
    }
    if(!req.body.itemId)
    {
        return res.status(400).send("itemId is empty");
    }
    if(!req.body.catID)
    {
        return res.status(400).send("catID is empty");
    }
    if(!req.body.uPrice)
    {
        return res.status(400).send("uPrice is empty");
    }
    if(!req.body.uPrice)
    {
        return res.status(400).send("uPrice is empty");
    }
     
    let itemData = new itemModel({
        name:req.body.name,
        itemId:req.body.itemId,
        catID:req.body.catID,
        imageURL:req.body.imageURL,
        uPrice:req.body.uPrice,
        description:req.body.description,
        status:req.body.status,
        discount:req.body.discount,
        videoLink:req.body.videoLink
    })

   try{
    itemData = await itemData.save();
    
   res.json(itemData);
   } catch(err) {

       res.json({message: err});
   }


   
});



router.get("/find/:id",async(req,res)=>{
    
    let reqID=req.params.id
    try{
    let item=await itemModel.findById(reqID);
    
    if(!item){
        return res.status(404).send("No such Item")
    }
    res.send(item)
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
  
});

router.put("/:id",async (req,res)=>{
    let reqID=req.params.id
    try{
    let item= await itemModel.findByIdAndUpdate(reqID,{
        name:req.body.name,
        itemId:req.body.itemId,
        catID:req.body.catID,
        imageURL:req.body.imageURL,
        uPrice:req.body.uPrice,
        description:req.body.description,
        status:req.body.status,
        discount:req.body.discount,
        videoLink:req.body.videoLink
    });

    if(!item){
        return res.status(404).send("no such Item")
    }
    
    return res.send("Item updated successfully");
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
});

router.delete("/:id",async(req,res)=>{
    let reqID=req.params.id
    try{
    let item=await itemModel.findByIdAndDelete(reqID);
    if(!item){
        return res.status(404).send("no such item")
    }
    

    res.json(item);
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
});


router.get('/getenableitems' ,async (req,res) => {

    const status = req.query.status;
    
 
    
        try{
           

            const item = await itemModel.find({status:status});
            res.status(200).json(item)
    
        }catch(err){
            res.status(404).json({message:err})
        }
    
    
   
});

router.get('/getviewmoreitems' ,async (req,res) => {

    const id = req.query.id;
    
 
    
        try{
           
            if(id == "")
            {
                res.status(404).json({message:"Id is required"});
            }
            else
            {
                const item = await itemModel.find({_id:id});
                res.status(200).json(item)
            }
            
    
        }catch(err){
            res.status(500).json({message:err})
        }
    
    
   
});

router.get('/searchitems' ,async (req,res) => {

    const text = req.query.text;
    
 
    
        try{
           

            const item = await itemModel.find({$and:[{name:{ $regex: text, $options: "i" }}, {status:true} ]});
            res.status(200).json(item)
    
        }catch(err){
            res.status(500).json({message:err})
        }
    
    
   
});


module.exports = router