const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const { response } = require('express');
const client = new OAuth2Client("212464559860-30tq5g85gv1pjfhkd172iagcuud1a8e6.apps.googleusercontent.com")
const fetch = require('node-fetch');
// add methods here 
//Registration

router.post('/register',async (req,res) => {

    //check user already exits
 
    const emailExitst = await User.findOne({email:req.body.email})
 
    if(emailExitst) return res.status(400).json({message:"email already exits"})
     
     //password hash
     const bcri = await bcript.genSalt(10);
     const hashpassword = await bcript.hashSync(req.body.password,bcri);
 
     const user = new User({
         uid : req.body.uid,
         name : req.body.name,
         email : req.body.email,
         IsAdmin: req.body.IsAdmin,
         password : hashpassword
     });
      
     try {
         const saveduser = await user.save()
         res.json(saveduser);
 
     }catch(err) {
         res.status(400).json(err);
     }

 });


 router.post('./facebooklogin' , async = (req,res) => {
    const {userID, accessToken} = req.body;

    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_tokens=${accessToken}`
    fetch(urlGraphFacebook, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
        const {email, name} = res;
        User.findOne({email}).exec((err, user) => {
            if(err) {
                  return res.status(400).json({
                      error: "This gmail already exists"
                  })
              } else {
                  if(user) {
                    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
                    const {_id, name, email} = user;

                    res.json({
                        token,
                        user: {_id, name, email}
                    })
                  } else {
                        let password = email+process.env.TOKEN_SECRET;
                        let newUser = new User({name, email, IsAdmin, Password});
                        newUser.save((err,data) => {
                            if(err) {
                                return res.status(400).json({
                                    error: "This gmail already exists"
                                })
                            }
                            const token = jwt.sign({_id: data._id}, process.env.TOKEN_SECRET)
                            const {_id, name, email} = newUser;

                            res.json({
                                token,
                                user: {_id, name, email}
                            })
                        })

                  }
              }
        })
    })

});

router.post('./googlelogin' , async = (req, res) => {
    const {tokenId} = req.body;

    client.verifyIdToken({token: tokenId, audience: "212464559860-30tq5g85gv1pjfhkd172iagcuud1a8e6.apps.googleusercontent.com"}).then(response => {
     const{email_verified, name, email} = response.payload;
      if(email_verified) {
          User.findOne({email}).exec((err,user) => {
              if(err) {
                  return res.status(400).json({
                      error: "This gmail already exists"
                  })
              } else {
                  if(user) {
                    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
                    const {_id, name, email} = user;

                    res.json({
                        token,
                        user: {_id, name, email}
                    })
                  } else {
                        let password = email+process.env.TOKEN_SECRET;
                        let newUser = new User({name, email, IsAdmin, Password});
                        newUser.save((err,data) => {
                            if(err) {
                                return res.status(400).json({
                                    error: "This gmail already exists"
                                })
                            }
                            const token = jwt.sign({_id: data._id}, process.env.TOKEN_SECRET)
                            const {_id, name, email} = newUser;

                            res.json({
                                token,
                                user: {_id, name, email}
                            })
                        })

                  }
              }
          })
      }

     })
    console.log()
});





//login

router.post('/login', async (req,res) => {

 
     
    const emailExitst = await User.findOne({email:req.body.email})

   if(!emailExitst) return res.json({message:"email or password invalid"});

   //passwordcheck

   const validpass = await bcript.compareSync(req.body.password,emailExitst.password)

   if(!validpass) return res.json({message: "invalid username or password"})
   
  //token create
  const token = jwt.sign({_id: emailExitst._id},process.env.TOKEN_SECRET)

  return res.json({message: "successfully login",Token:token,IsAdmin:emailExitst.IsAdmin,UserId:emailExitst._id})

});

// chanaka created password reset
router.put("/psw_reset/:id", async(req, res) =>{
    console.log("accesseed succeesews")
    let reqID = req.params.id
  
   //password hash
   const bcri = await bcript.genSalt(10);
   const hashpassword = await bcript.hashSync(req.body.password,bcri);

    let user = await User.findByIdAndUpdate(reqID,{
      password:hashpassword
    })
  
    if(!user){
      return res.status(404).send("no such Item")
  }
  return res.send("Item updated successfully");
  
  });
  // end of chanaka updated
  


module.exports = router