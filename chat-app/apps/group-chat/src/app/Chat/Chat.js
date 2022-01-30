import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { useAuthState } from '../contexts/FirebaseContext';

export default function Chat() {
  const { isAuthenticated, user } = useAuthState();

  const [socket, setsocket] = useState(null);
  const [messages, setmessages] = useState([]);

  useEffect(() => {
    user.getIdToken().then((jwt) => {
      const socket = new io(`http://api.localhost`, { auth: { jwt }, transports: ['websocket'] });
      setsocket(socket);






      socket.on('message', (data) => {
        const newMessages = [];
        console.log(messages);
  
        newMessages.push(data);
        newMessages.concat(messages);
        setmessages(oldArray => [...oldArray, data]);
        console.log(messages);

      });
  
    });


  }, []);



  return (
    <div>
      <input
        onChange={(e) => {
          socket.emit('message', { message: e.target.value });
        }}
      ></input>

      <br />
      {messages.map((item, index) => (
        <div id={`${item}-${index}`}>{item}</div>
      ))}
    </div>
  );
}
