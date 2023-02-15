let express=require("express")
let mongodb=require('mongodb')

let app=express()
let db=null

const MongoClient=mongodb.MongoClient;

let dbstring='mongodb+srv://diwaarvind:Navabalan%2316@cluster0.tuccn49.mongodb.net/myapp?retryWrites=true&w=majority'

let dbname='myapp'

let port=process.env.PORT
if(port== null || port==""){
    port=3000
}

MongoClient.connect(dbstring,{ useNewUrlParser: true,useUnifiedTopology: true },function(err,client){
if(err){
    throw err
}
db=client.db(dbname)
app.listen(port)
})

app.use(express.json())//for using json file
app.use(express.urlencoded({extended:false})) //for using express


app.use(express.static('public2'))//to use the folder

function pass(req,res,next){
    res.set("www-Authenticate",'Basic realm="simple app"')
    if(req.headers.authorization=='Basic cm9ja2J5Onh4eA=='){
        next()
    }else{
        res.status(401).send("Sorry invalid data")
    }
}

app.use(pass)
 
app.get('/',(req,res)=>{
    db.collection('items').find().toArray(function(err,items){
// console.log(items)
res.send(`
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lets remember things</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
       <link rel="stylesheet" type="text/css" href="/style.css">
    </head>
    <body>
    
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
        //jquery is a lightweight "writeless do more js library"
    <script
  src="https://code.jquery.com/jquery-3.6.1.slim.min.js"
  integrity="sha256-w8CvhFs7iHNVUtnSP0YKEg00p9Ih13rlL9zGqvLdePA="
  crossorigin="anonymous"></script>


        <span>To-Do App</span>
        <div id="list">
        <form action="/create-item" method="POST">
        <div class="item">
            <input name="item" autocomplete="off">
            </div>
            <button class ="button0" id="button0"> Send message</button>
        </form>
        </div>
        <ul class="ulo">

        //   map is used to create a new array and store the value in it

        ${items.map(function(item){
            
        
        return `<li>
        <div class="container">        
            <div id="list1">
            <span class="item-text">${item.text}</span>
            <button data-id=${item._id} class="button1" id="button1">Edit</button>
            <button data-id=${item._id} class="button2">Delete</button>
        </div>
        </li>
        `}).join('')}

            </li>
            </ul>
        </div>
        <script>document.querySelector(".ulo).style.backgroundColor="red"</script>

        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

         <script src="/bowser.js"></script>
    </body>
</html>`
)
})
})



app.post('/create-item', (req,res)=>{
   db.collection('items').insertOne({text:req.body.item},function(){
    res.redirect('/')
   })
   
})

app.post("/update-item",(req,res)=>{
    // console.log(req.body.text)
    db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectId(req.body.id)},{$set:{text:req.body.text}},function(){
        res.send("data updated")
    })
})

app.post("/delete-item",(req,res)=>{
    db.collection("items").deleteOne({_id:new mongodb.ObjectId(req.body.id)},function(){
        res.send("data deleted")
    })

})