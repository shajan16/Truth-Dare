import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import SpinWheel from "./components/SpinWheel";
import Private from "./components/private";

const socket = io("https://truth-dare-server-hi2i.onrender.com");

export default function App() {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [joined, setJoined] = useState(false);
  const [game, setGame] = useState(null);
  const [result, setResult] = useState(null);
  const [emojiFeed, setEmojiFeed] = useState([]);
  const[givescore, setscore]=useState("")
  const [showResult, setShowResult] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  function demo(){
     let data=showResult.player.name;
    setscore(data)
  }

  useEffect(() => {
  socket.on("receive_message", (data) => {
    setChat(prev => [...prev, data]);
  });

  return () => socket.off("receive_message");
}, []);

  const sendMessage = () => {
  if (message.trim() !== "") {
    socket.emit("send_message", {
      room,
      name,
      message
    });
    setMessage("");
  }
};

useEffect(() => {
  const chatBox = document.getElementById("chatBox");
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}, [chat]);

  useEffect(() => {
  if (result) {
    setShowResult(null);

    const timer = setTimeout(() => {
      setShowResult(result); 
    }, 9500); 

    return () => clearTimeout(timer);
  }
}, [result]);

  const join = () => {
    if (room && name && avatar !=="") {
      socket.emit("join_room", { room, name, avatar });
      setJoined(true);
    }else{
      alert(`Enter your ${name==""? "Name, ":""}${room==""? "Room ":""}${name && room !=="" ? "":"and "}${avatar==""&& "Avatar"}`)
    }
  };

  useEffect(() => {
    socket.on("update", setGame);
    socket.on("spin_result", (data) => {
         setResult(data)});
    socket.on("emoji", (e) => {
      setEmojiFeed(prev => [...prev, e]);
      setTimeout(()=>setEmojiFeed(prev=>prev.slice(1)),2000);
    });

    return () => {
    socket.off("update");
    socket.off("spin_result");
    socket.off("emoji");
    }
  }, []);
  

  if (!joined) {
   return (
      <div className="h-screen flex flex-col items-center justify-center bg-linear-to-br from-black via-purple-900 to-black">
        <h1
          className="
            text-4xl md:text-6xl font-extrabold text-center
            bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500
            bg-clip-text text-transparent
            drop-shadow-lg
            tracking-wider
            animate-pulse
            mb-10
          "
        >
          🎮 TRUTH OR DARE
        </h1>
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl flex flex-col gap-10 w-[80%] md:w-[30%]">
          <input className="flex-1 px-4 py-2 rounded-lg bg-white/20 outline-none" placeholder="Name" onChange={e => setName(e.target.value)} />
          <input className="flex-1 px-4 py-2 rounded-lg bg-white/20 outline-none" placeholder="Room" onChange={e => setRoom(e.target.value)} />
          <select className="flex-1 px-4 py-2 rounded-lg bg-white/20 outline-none" onChange={e => setAvatar(e.target.value)}>
            <option value="">Avatar</option>
            <option>🦸🏻‍♂️</option> <option>🧛‍♀️</option> <option>😈</option> <option>👻</option> <option>🦋</option>
          </select>
          <div className="justify-center flex"> 
          <button
            onClick={join}
            className="
              w-50 mt-4 py-3 rounded-xl
              bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500
              text-white font-semibold tracking-wide
              shadow-sm shadow-pink-500/30
              backdrop-blur-md
              hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40
              active:scale-95
              transition-all duration-300
            "
          >
            Join 🚀
          </button>
          </div>
        </div>
      </div>
    );
  }

  // Private
  if (name==="shajanreesvi" && room === "1620") {
  return(
    <Private/>
  )
} else{

  return (
    <div className="p-4 text-white">
        <div className=" mb-6">
    <h2 className="
      text-2xl md:text-3xl font-bold
      bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500
      bg-clip-text text-transparent
      tracking-wide
    ">
      🎮 Room: <span className="text-white">{room}</span>
    </h2>
  </div>


     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 md:gap-0">

    {game?.players.map((p, index) => (
      <div
        key={p.id}
        className={`
          p-4 rounded-2xl flex justify-between items-center md:w-[70%]
          backdrop-blur-xl bg-white/10 border border-white/20
          shadow-lg transition-all duration-300
          hover:scale-105 hover:shadow-purple-500/30 
          ${game.turn === index ? "ring-2 ring-yellow-400 scale-105" : ""}
        `}
      >

        {/* AVATAR */}
        <div className="flex">
        <div className="text-3xl md:text-4xl text-center">
          {p.avatar}
        </div>

        {/* NAME */}
        <div className="mt-2 text-center font-semibold text-white">
          {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
        </div>
        </div>

        {/* SCORE */}
        <div className="text-center text-sm text-white/70">
          <span className="animate-pulse"> ⭐ </span>{p.score}
        </div>

        {/* TURN BADGE */}
        {/* {game.turn === index && (
          <div className="mt-2 text-center text-xs text-yellow-300 animate-pulse">
            🔥 Playing
          </div>
        )} */}

      </div>
    ))}

  </div>

      <SpinWheel 
      result={result} // 👈 MUST
      isMyTurn={game?.players[game?.turn]?.name === name}
      onSpin={()=>socket.emit("spin", room)}
      />

      {showResult && (
  <div className="mt-8 text-center">
    <h2 className="text-2xl font-bold text-yellow-300 animate-pulse">
      {showResult.type} for {showResult.player.name.charAt(0).toUpperCase()+ showResult.player.name.slice(1)}.
    </h2>
    <p className="text-xl text-center md:mb-10">{showResult.question.charAt(0).toUpperCase()+ showResult.question.slice(1)}</p>

    {name !== showResult.player.name && (
      <button
        onClick={() =>
          {socket.emit("complete", { room, givescore}),
        demo()
        }
        }
        className="mt-4 px-6 py-2 bg-green-500 rounded-xl"
      >
        Done ✅
      </button>
    )}
  </div>
)}

 {/* bottom */}
    <div className=" md:flex md:w-full md:justify-between md:px-10 md:absolute md:top-20">
      <div className="mt-5 flex text-2xl justify-center items-center">
        <div className="gap-8 flex h-fit flex-wrap px-4 justify-center py-2 md:w-[55%] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
        {["😂","🔥","😍","😱","🫂","💗"].map(e => (
          <button className="hover:scale-150 transition-all duration-300 ease-in-out" key={e} onClick={()=>socket.emit("emoji", {room, emoji:e})}>{e}</button>
        ))}
        </div>
      </div>

      <div className="fixed top-10 right-10">
        {emojiFeed.map((e,i)=>(<div key={i} className="text-3xl">{e}{e}{e}</div>))}
      </div>

 {/* chatbox */}
  <div className="mt-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 ">

  <h2 className="text-lg font-semibold mb-3 text-center">💬 Chat</h2>

  {/* MESSAGES */}
  <div id="chatBox" className="h-60 overflow-y-auto space-y-2 mb-4 pr-2">
    {chat.map((msg, i) => (
      <div
        key={i}
        className={`p-2 rounded-lg text-sm max-w-[70%] ${
          msg.name === name
            ? "ml-auto bg-pink-500/30 text-right"
            : "bg-white/10"
        }`}
      >
        <div className="font-semibold text-xs text-white/70">
          {msg.name} • {msg.time}
        </div>
        <div>{msg.message}</div>
      </div>
    ))}
  </div>

  {/* INPUT */}
  <div className="flex gap-2">
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 px-4 py-2 rounded-lg bg-white/20 outline-none"
    />
    <button
      onClick={sendMessage}
      className="px-4 py-2 rounded-lg bg-linear-to-r from-pink-500 to-purple-600 hover:scale-105 transition"
    >
      Send
    </button>
  </div>

</div>
</div>

      <audio id="spinSound" src="/spin.mp3" />
    </div>
  );

}
}
