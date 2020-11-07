//imports
import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import cors from 'cors'
import mongoMessages from "./messageModel.js"

//app config
const app=express();
const port=process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1102873",
    key: "a4119da617c474d2f9f8",
    secret: "4564d8f2efc4f9a8d4d9",
    cluster: "ap2",
    useTLS: true
  });

//middlewares
app.use(express.json())
app.use(cors())

//db config
const mongoURI= 'mongodb+srv://admin:AKLxWeswhhm9pUXD@cluster0.r3bpp.mongodb.net/messengerDB?retryWrites=true&w=majority'

mongoose.connect(mongoURI,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open',()=>{
    console.log('DB Connected')

    //whenver something changes
    const changeStream=mongoose.connection.collection('messages').watch()
    changeStream.on('change',(change)=>{
        pusher.trigger("messages", "newMessage", {
            'change': change
          });
    })
})

//api routes
app.get('/', (req,res)=>res.status(200).send('Hello world'))

app.post('/save/message', (req,res)=>{

    //saved the new message into a variable
    const dbMessage= req.body;
    
    
    //storing into db
    mongoMessages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

app.get('/retrieve/conversation', (req,res)=>{
    mongoMessages.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            data.sort((b,a)=>{
                return a.timestamp-b.timestamp;
            })
            res.status(200).send(data)
        }
    })
})


//listen
app.listen(port, ()=>console.log(`listening on port:${port}`))