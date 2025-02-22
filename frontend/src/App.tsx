import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState(["Hii there", "hiii"]);
  const wsRef = useRef();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roodId: "red"
        }
      }))
    }
    return () => {
      ws.close()
    }
  }, [])
  return (
    <div className="h-screen bg-black">
      <br /> <br />
      <div className="h-[90vh]">
        {messages.map(message => <div className="m-8">
          <span className="bg-white p-4 rounded ">
            {message}
          </span>
        </div>)}
      </div>
      <div className="w-full bg-white flex">
        <input id="message" className="flex-1 p-4" />
        <button onClick={() => {
          const message = document.getElementById("message")?.value;
          wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
              message: message
            }
          }))
        }} className="bg-purple-600 text-white p-4"> Send Message</button>
      </div>

    </div>
  )
}

export default App;
