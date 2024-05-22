const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});


exports.register=(req,res)=>{
  console.log(req.body);

  // const name=req.body.name;
  // const email=req.body.email;
  // const password=req.body.password;
  // const confirm_password=req.body.confirm_password;

  // console.log(name);

 const {name,email,password,confirm_password}=req.body;
 db.query('select email from users where email=?',[email],(error,result)=>{
  if(error){
    console.log("error:",error);
  }
 if(result.length>0){
  return res.render("register",{msg:`Email ID already taken`});
 }
 })
 console.log(password);
  // console.log("form submitted");
  // res.send("form submitted");
};



