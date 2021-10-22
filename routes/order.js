const express = require('express');
const order = require('../models/order');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Order = require('../models/order');
const verifytoken = require('../tokenVerify');

//add order
router.post('/add', verifytoken,async (req,res) => {
    
    //get the token
    const token = req.body.Token;
    const verify = jwt.verify(token,process.env.TOKEN_SECRET);

    //insert data as a object 
    const order = new Order ({
        userId : verify._id,
        orderNo: req.body.orderNo,
        TotalAmount : req.body.TotalAmount,
        itemdetails: req.body.itemdetails,
        AddressShiping: req.body.AddressShiping,
    })

    //save data to database
    try{
    const savedone = await order.save()
    res.status(200).json(savedone);
    } catch(err) {
        res.status(404).json({message: err});
    }  
});


router.get('/getorders' ,async (req,res) => {

    const token = req.query.token;
    
 
    
        try{
            const verify = jwt.verify(token,process.env.TOKEN_SECRET);

            const order = await Order.find({userId:verify._id});
            res.status(200).json(order)
    
        }catch(err){
            res.status(500).json({message:err})
        }
    
   
});

//Mevan's code start
router.get('/getOrderStat',async(req,res)=>{
    try{
        let orderStats= await order.aggregate( [
            {
              $group: {
                 _id: {
                    
                    date: { $dateToString: {
                       format: "%Y-%m-%d",
                       date: "$date"
                    }}
                 },
                 TotalAmount: { $sum: "$TotalAmount" }
              }
            },
            { $sort: { TotalAmount: 1 } }
         ] )

         res.json(orderStats);
    }
    catch(ex){
        return res.status(500).send("error",ex.message);
    }
});


router.get('/getallpaidOrders',async(req,res)=>{

    try{
        let orders= await order.find({Status:1});
        res.json(orders);
    }catch(ex){
        return res.status(500).send("error",ex.message);
    }

});

router.get('/getNewOrderCount',async(req,res)=>{

    try{
        let orders= await order.find({Status:1}).countDocuments();
        res.json(orders);
    }catch(ex){
        return res.status(500).send("error",ex.message);
    }

});

router.put("/updateStatus/:id",async (req,res)=>{
    let reqID=req.params.id
    try{
        let order= await Order.findByIdAndUpdate(reqID,{
            Status:req.body.Status,
            
        });
    
        if(!order){
            return res.status(404).send("no such Order")
        }
        
        return res.send("Order updated successfully");
    }
    catch(err){
        return res.status(500).send("error",err.message);
    }
    

});
//Mevan's code end

router.get('/getselectedorder' ,async (req,res) => {

    const token = req.query.token;
    const OrderId = req.query.orderid;
 
    
        try{
            if(OrderId == "")
            {
                res.status(404).json({message:"Order Id required"});
            }
            else
            {
                const verify = jwt.verify(token,process.env.TOKEN_SECRET);

                const order = await Order.find({_id: OrderId});
                res.status(200).json(order);
            }
            
    
        }catch(err){
            res.status(500).json({message:err})
        }
    
     
    
   
});



router.get('/getitemqty' ,async (req,res) => {

    const token = req.query.token;
    const itemid = req.query.itemid;
 
    
        try{

            if(itemid == "")
            {
                res.status(404).json({message:"item Id required"});
            }
            else
            {

                const verify = jwt.verify(token,process.env.TOKEN_SECRET);

                const order = await Order.find({"itemdetails._id": itemid}).sort({AddressShiping:"asc"}).select({itemdetails:1});
           
                res.status(200).json(order)

            }
            
    
        }catch(err){
            res.status(500).json({message:err})
        }


       
    
     
    
   
});

router.put('/updateaddress/:id', verifytoken,async (req,res) => {

    let id = req.params.id;

    try{
      
        if(id =="")
        {
            res.status(404).json({message:" Id required"});
        }
        else
        {

            const order = await Order.findById(id);

            if(!order) {
            return res.status(404).json({message:"Cannot find this order"})
            }
    
            order.set({AddressShiping: req.body.AddressShiping});
            order.save();
            return res.status(200).json(order);

        }

        

    }catch(err)
    {
        return res.status(500).json({message:"something went wrong"});
    }

   


});



router.put('/updateitemqty/:id', verifytoken,async (req,res) => {

    let id = req.params.id;

    if(id == "")
    {
        return res.status(404).json({message:"Id required"});
    }
    else
    {

        if(req.body.qty == "")
        {
            return res.status(404).json({message:"Qty required"});
        }
        else
        {

            let order = Order.findOne({"itemdetails._id": id}).then(doc => {
                item = doc.itemdetails.id(id);
                item["qty"] = req.body.qty;
               
               
                doc.save();
              
                //sent respnse to client
              }).catch(err => {
                return res.status(500).json({message:"something went wrong"});
              });
            return res.status(200).json({message: "UpdateSuccess"});

        }
    }

   


});

module.exports = router