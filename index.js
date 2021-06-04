let express = require('express');
let app = express();

app.set("view engine", "ejs");
app.set("views", "./Views");
app.use(express.static("Public")); 

app.listen(4000,()=>{ console.log("Happy hacking...")}) 

//connect Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://cusen11:h06c8pnaCSSmR1ix@cluster0.g7cyd.mongodb.net/Mavels?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true}, (err)=>{
    if(err){
        console.log("Connect error")
    }
    else{
        console.log("Connect successfull")
    }
})


//parser json post
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// gọi multer để upload file 
// https://github.com/khoaphp/Multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/png" || file.mimetype=="image/gif" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }

// }).single("avatar") avatar là name của chổ upload
}).single("avatar");


//Gọi model 

var Mavel = require("./Models/Mavels");

app.get("/", (req,res)=>{
    res.send("Home page");
})

app.get("/add", (req,res)=>{
    res.render("add");
})

app.post('/add', (req,res)=>{
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
        }else{
            var mavel = Mavel({  
                name: req.body.name,
                image:req.file.filename,
                level:req.body.level
            }) 
             
            mavel.save((err)=>{
                if(err){
                    res.json({"Kết quả": 0, "errMsg": err})
                }
                else{
                    res.json({"Kết quả": 1})
                }
            })
        }

    });
})

// list item

app.get('/list',(req,res)=>{
    Mavel.find((err,data)=>{
        if(err){
            res.json({"kq":0, "errMsg": err})
        }
        else{
            res.render("list",{danhsach:data})
        }
    }) 
})
