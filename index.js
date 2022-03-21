const express = require("express")
const { default: mongoose } = require("mongoose")
const {body,validationresul}=require("express-validator")
const app = express()

app.use(express.json())

const connect = ()=>mongoose.connect(
    "mongodb+srv://web15:web15@cluster0.zieim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )


   // UserSchema
   const UserSchema= new mongoose.Schema({
       first_name:{type:String,required:true},
       last_name:{type:String,required:true},
       age:{type:Number,required:true},
       email:{type:String,required:true}
   },
   {
       timestamps:true,
       versionKey:false
   }
   )

   const User= new  mongoose.model("user",UserSchema)


   //book schema
  const bookSchema= new mongoose.Schema({
    likes:{type:Number,required:true},
    
    content:{type:String,required:true}
},
{
    timestamps:true,
    versionKey:false
}
)
const Book= new  mongoose.model("book",bookSchema)

//publication schema
const publicationSchema= new mongoose.Schema({
    name:{type:Number,required:true},
    
  
},
{
    timestamps:true,
    versionKey:false
}
)
const Publication= new  mongoose.model("publication",publicationSchema)

//comment schema
const commentSchema= new mongoose.Schema({
    post_comment:{type:Number,required:true},
    
  
},
{
    timestamps:true,
    versionKey:false
}
)

const comment= new  mongoose.model("comment",commentSchema)
//book controller
app.get("/users",async(req,res)=>{
    const user = await User.find().lean().exec()
    return res.status(200).send(user)
})


app.post("/users",

body("likes").not().isEmpty().withMessage("age is required").default(10)
.custom(async(value)=>{
    if(value>10){
        throw new Error("age is incorect")
    }
    return true
}),
body("email").isEmail().custom(async(value)=>{
 const user = await User.findOne({email:value})
 if(user){
     throw new Error("email already exists")
 }return true
}),
async(req,res)=>{
   try {

   const user=await User.create(req.body)
   return res.status(200).send(user)

       
   } catch (error) {

     return res.status(500).send(error.message);
       
   }
})


   //controller

   app.get("/users",async(req,res)=>{
      try {
          const page =req.query.page||1;
          const pagesize=req.query.pagesize||10;

          const skip=(page-1)*pagesize
          const user =await User.find()
          .skip(skip)
          .limit(pagesize)
          .lean()
          .exec()

          const totalpages=Math.ceil(await User.find().countDocuments())/pagesize
           return res.status(200).send({user,totalpages})
          
      } catch (error) {
        return res.status(500).send({message:error.message})  
      }
   })

   //validation

   app.post("/users",
   body("firts_name").not().isEmpty().withMessage("firts name is required"),
   body("last_name").not().isEmpty().withMessage("last name is required")
   .custom(async(value)=>{

    if(value.length>3 && value.length<20){
      return true
    }
    throw new Error("name length should be min 3 or max 20 words")

   }),
   body("age").not().isEmpty().withMessage("age is required")
   .custom(async(value)=>{
       if(value>120){
           throw new Error("age is incorect")
       }
       return true
   }),
   body("email").isEmail().custom(async(value)=>{
    const user = await User.findOne({email:value})
    if(user){
        throw new Error("email already exists")
    }return true
   }),
   async(req,res)=>{
      try {

      const user=await User.create(req.body)
      return res.status(200).send(user)

          
      } catch (error) {

        return res.status(500).send(error.message);
          
      }
   })

    app.listen(5000,()=>{
        connect()
        console.log("port is listening on 5000")
    })