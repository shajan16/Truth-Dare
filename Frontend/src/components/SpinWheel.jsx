import { useEffect, useState } from "react";
import music from '../assets/videoplayback.mp4'

const segments = ["Truth", "Dare","Truth", "Dare","Truth", "Dare"];

export default function SpinWheel({ result, isMyTurn, onSpin }) {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (result?.angle) {
      setSpinning(true);

      setAngle(prev => prev + result.angle);

      let speed = 50;
      const tickSound = document.getElementById("tickSound");

      const tickInterval = setInterval(() => {
        if (tickSound) {
          tickSound.currentTime = 0;
          tickSound.play();
        }

        speed += 20;

        if (speed > 300) {
          clearInterval(tickInterval);
        }
      }, speed);


      setTimeout(() => {
        setSpinning(false);
        tickSound.pause()

        const wheel = document.getElementById("wheel");
        if (wheel) {
          wheel.classList.add("animate-pulse");
          setTimeout(() => wheel.classList.remove("animate-pulse"), 500);
        }

      }, 9500);
    }
  }, [result]);

  return (
    <div className="flex flex-col items-center mt-10 mx-auto">

      {/* POINTER */}
      <div className="w-0 h-0 border-l-12 border-r-12 border-b-24 border-l-transparent border-r-transparent border-b-yellow-400 mb-2 drop-shadow-lg"></div>

      {/* WHEEL */}
      <div
        id="wheel"
        className="relative flex justify-center items-center w-62 h-62 md:w-70 md:h-70 rounded-full border-10 border-white shadow-2xl transition-transform duration-9500 ease-out"
        style={{
          transform: `rotate(${angle}deg)`,
          background: `conic-gradient(
            #ff4d6d 0deg 60deg,
            #8338ec 60deg 120deg,
            #3a86ff 120deg 180deg,
            #ffbe0b 180deg 240deg,
            #06d6a0 240deg 300deg,
            #fb5607 300deg 360deg
          )`
        }}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            className="text-white font-bold text-sm absolute"
            style={{
              transform: `rotate(${i * 60}deg) translate(90px) rotate(-${i * 60}deg)`
            }}
          >
            {seg}
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={onSpin}
        disabled={!isMyTurn || spinning}
        className={`mt-8 px-8 py-3 rounded-xl text-lg transition ${
          isMyTurn && !spinning
            ? "bg-linear-to-r from-pink-500 to-purple-600 hover:scale-110"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {spinning ? "SPINNING 🎡..." : isMyTurn ? "SPIN 🎯" : "WAIT ⏳"}
      </button>

      {/* SOUND */}
      <audio id="tickSound" src={music} preload="auto" />

    </div>
  );
}