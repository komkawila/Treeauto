import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import {socketurl} from './api'
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = socketurl;

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      // const incomingMessage = {
      //   ...message,
      //   // ownedByCurrentUser: message.senderId === socketRef.current.id,
      // };
      const incomingMessage = message;
      // setMessages((messages) => [...messages, incomingMessage]);
      setMessages(message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      // senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
