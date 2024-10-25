import { useState, useEffect, useRef } from "react";
import io from "socket.io-client"; // Asegúrate de tener esta importación
import "./App.css";

const socket = io("http://localhost:3000"); // Cambia la URL según la configuración del backend

function App() {
  const [user, setUser] = useState("");
  const [isUserSet, setIsUserSet] = useState(false);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (user.trim()) {
      setIsUserSet(true);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-pallette-1">
      <div className="w-[600px] min-h-[600px] bg-pallette-2 rounded-[15px]">
        <div className="flex items-center justify-center ml-[20px] mt-[15px] bg-transparent">
          <h className="text-xl font-bold">Real chat time for portfolio</h>
        </div>
        {!isUserSet ? (
          <form
            onSubmit={handleUserSubmit}
            className="flex flex-col items-center justify-center mt-4 h-[500px]"
          >
            <input
              type="text"
              placeholder="Enter your username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-1/2 p-2 rounded-lg border border-gray-300"
            />
            <button
              type="submit"
              className="mt-3 bg-pallette-3 text-white rounded-lg px-4 py-2"
            >
              Join in the chat
            </button>
          </form>
        ) : (
          <div className="mt-[10px] w-full">
            <ChatBox localUser={user} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

const ChatBox = ({ localUser }) => {
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    socket.on("chat msg", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("chat msg");
    };
  }, []);

  const submitMsg = (e) => {
    e.preventDefault();
    const chatMessage = chatRef.current.value;

    if (chatMessage) {
      console.log("Enviando mensaje:", chatMessage);
      socket.emit("chat msg", { msg: chatMessage, user: localUser });
      chatRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="mt-[5px] mx-[15px] border-[1px] border-gray-200 h-[500px] rounded-[15px] bg-pallette-1">
        {messages.map((message, index) => (
          <div
            className={`flex ${
              message.user === localUser ? "justify-start" : "justify-end"
            }`}
            key={index}
          >
            <p
              className={`m-[15px] px-[10px] py-[5px] rounded-[10px] bg-pallette-2 w-fit`}
            >
              {message.user ? message.user : "anonymous"}: {message.msg}
            </p>
          </div>
        ))}
      </div>
      <div className="mx-[15px] mb-[5px] rounded-b-[15px] h-[80px] flex justify-start items-center flex-row">
        <form onSubmit={submitMsg} className="flex justify-between">
          <textarea
            ref={chatRef}
            id="chat"
            className="w-[500px] h-[60px] rounded-[15px] px-[4px]"
          />
          <button
            className="m-[5px] rounded-[20px] p-[10px] bg-pallette-3"
            type="submit"
            id="send"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
