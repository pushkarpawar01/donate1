import React, { useState, useEffect } from "react";
import "./ChatButton.css";

const ChatButton = () => {
  // const [chatUrl, setChatUrl] = useState("");

  // useEffect(() => {
  //   fetch("/chat-url")
  //     .then((res) => res.json())
  //     .then((data) => setChatUrl(data.url))
  //     .catch((err) => console.error("Error fetching chat URL:", err));
  // }, []);

  return (
    <div className="chatbo">

   
    <a href=" http://localhost:3000/">Click  here to chat</a>
    </div>
  );
};

export default ChatButton;
