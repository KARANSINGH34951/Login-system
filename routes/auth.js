const express = require("express")
const router = express.Router();
const usercontroller = require("../controller/user")
router.post("/register",usercontroller.register,(err)=>{
  console.log(err);
});

module.exports=router;