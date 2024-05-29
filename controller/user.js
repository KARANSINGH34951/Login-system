const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.login=async(req,res)=>{
try{
  const{email,password}=req.body;
  if(!email || !password){
    return res.status(400).render("login",{
      msg:"please enter your mail or name corretly",
      msg_type:"error",
    })
  }

  db.query('select * from users where email=?',[email],async(error,result)=>{
    console.log(result);
    if(result.length<=0){
      return res.status(401).render("login",{
        msg:"email or password is incorrect ",
        msg_type:"error",
      })
    }
    else{
      if(!(await bcrypt.compare(password,result[0].PASSWORD))){
        return res.status(401).render("login",{
          msg:"email or password is incorrect ",
          msg_type:"error",
        })
      }
      else{
        // res.send("good")
        const id= result[0].ID
        const token = jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})

        console.log("token"+token);
        const cookieoptions= {expires:new Date( Date.now()+process.env.JWT_COOKIES_EXPIRES*24*60*60*1000),
          httpOnly:true,
         };
         
         res.cookie("tokenkey",token,cookieoptions);
         res.status(200).redirect("/home");
      }
    }
  })

}catch(error){
  console.log(error);
}
}

exports.register=(req,res)=>{
  console.log(req.body);

  // const name=req.body.name;
  // const email=req.body.email;
  // const password=req.body.password;
  // const confirm_password=req.body.confirm_password;

  // console.log(name);

 const {name,email,password,confirm_password}=req.body;``
 db.query('select email from users where email=?',[email],async (error,result)=>{
  if(error){
    console.log("error:",error);
  }
  
 if(result.length>0){
  return res.render("register",{msg:`Email ID already taken`,msg_type:"error"});
 }

else if(password!==confirm_password){
  return res.render("register",{msg:`Password do not match`,msg_type:"error"});
};
let hashedpassword= await bcrypt.hash(password,8);
// console.log(hashedpassword);

db.query('insert into users set ? ',{name:name,email:email,password:hashedpassword},(error,result)=>{
  if(error){
    console.log("error:",error);
  }
  else{
    console.log(result);
    return res.render("register",{msg:`User Registered`,msg_type:"err-free"});
  }
});
 })

 console.log(password);
  // console.log("form submitted");
  // res.send("form submitted");
};




