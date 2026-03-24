import { useEffect, useState } from "react";
import love from "../assets/music.mp3"

export default function Private() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const audio = document.getElementById("loveMusic");
    if (audio) audio.play().catch(()=>{});
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-br from-pink-500 via-purple-600 to-indigo-700">

      {/* 💖 Floating Hearts */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white/70 animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        >
          💗
        </div>
      ))}

      {/* 💎 Glass Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 max-w-xl text-center text-white animate-fadeIn">

        {!show ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Heyyyy 💗🫶🏻
            </h1>

            <p className="text-white/80 mb-6">
              I made something special for you... click below 💖
            </p>

            <button
              onClick={() => setShow(true)}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 hover:scale-105 transition"
            >
              OPEN
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-pulse">
              Cheloooo🌍💗
            </h1>

            <p className="text-white/90 leading-relaxed">
              Out of everyone in this world, I’m so lucky to have you.  
              You make my life brighter, my days happier, and my heart full.  

              Even in this little game, I wanted to hide something special…  
              just for you to find.  

              No matter what happens, I’ll always be there for you.  
              You’re my favorite person, my happiness, and my everything 💕
            </p>

            <div className="mt-6 text-xl animate-bounce">
              I Love You Reesviii..💗🫶🏻🫂
            </div>
          </>
        )}

      </div>

      {/* 🎶 Music */}
      <audio id="loveMusic" src={love} loop />

    </div>
  );
}