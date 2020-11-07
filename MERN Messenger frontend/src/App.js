import React, { useState,useEffect} from 'react';
import { Button, FormControl,InputLabel,Input, Icon} from '@material-ui/core';
import './App.css';
import Message from './Message';
// import db from './firebase';
// import firebase from 'firebase';
import FlipMove from 'react-flip-move';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core';
import axios from './axios';
import Pusher from 'pusher-js'

const pusher = new Pusher('a4119da617c474d2f9f8', {
  cluster: 'ap2'
});

function App() {
  const[input,setInput]=useState('');
  const[messages,setMessages]=useState([]);
  const[username,setUsername]=useState('');





  //useState= variable in REACT
  //useEffect= run code on a condition
  // useEffect(()=>{
  //   //any changes in the db, take the snapshot and stores in the snapshot variable 
  //  db.collection('messages')
  //  .orderBy('timestamp','desc')
  //  .onSnapshot(snapshot=>{
  //    //iterates over there by one by one
  //    setMessages(snapshot.docs.map(doc=>({id:doc.id, message:doc.data()})))
  //  })
    

  // },[] )

  
 //get code from mern backend
 const sync= async()=>{
  await axios.get('/retrieve/conversation')
  .then((res)=>{
    console.log(res.data);
    setMessages(res.data);
  })
}

  //sync function loads for mern backend
  useEffect(()=>{
    sync()
  },[])
  
 //pusher code
 useEffect(()=>{
  const channel = pusher.subscribe('messages');
  channel.bind('newMessage', function(data) {
    sync()
  });
 },[username])



  useEffect(()=>{
    //if [] is blank , this code runs once the app component loads
    setUsername(prompt('Enter Username'))

  },[] )

  const sendMessage=(event)=>{
    event.preventDefault();

  //  db.collection('messages').add({
  //    message:input,
  //    username: username,
  //    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  //  })

    axios.post('/save/message', {
      username: username,
      message: input,
      timestamp: Date.now()
      
    })
    
    setInput('');
  }
  return (
    <div className="App">
      <img src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100"/>
     <h1>Hello Guys!!</h1>
  <h2>Welcome {username}!!</h2>
     <form className="app__form">
        <FormControl className="app__formControl">
             <Input className="app__input" placeholder='Enter a message...'value={input} onChange={event=>setInput(event.target.value)} />
            <IconButton className="app__iconButton" disabled={!input} variant="text" color="primary" type="submit" onClick={sendMessage}>
            <SendIcon/>
            </IconButton>
        </FormControl>
     </form>

     <FlipMove>
      {
        messages.map(message =>(
          <Message key={message._id} message={message} username={username} />
        )
    
          )
      }
      </FlipMove>
    </div>

  );
}

export default App;
