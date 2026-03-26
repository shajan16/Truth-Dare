const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const dare = [
  "Do your best chicken dance 🐔",
  "Sing a song in a funny voice 🎤",
  "Talk like a robot for 1 minute 🤖",
  "Act like a baby until your next turn 👶",
  "Dance without music for 30 seconds 💃",
  "Do 10 jumping jacks right now 🏃",
  "Speak only in emojis for 2 minutes 😂🔥",
  "Pretend to be a cat 🐱",
  "Try to lick your elbow 😜",
  "Say the alphabet backwards 😂",
  "Act like your favorite celebrity 🎬",
  "Do your best evil laugh 😈",
  "Talk in slow motion for 1 minute 🐢",
  "Pretend you’re invisible for 30 seconds 👻",
  "Make a funny face and hold it for 20 seconds 😝",
  "Act like a teacher and scold someone 📚",
  "Dance like a robot 🤖",
  "Pretend to cry dramatically 😭",
  "Act like a monkey 🐒",
  "Talk without closing your mouth 😆",
  "Do a runway walk like a model 👗",
  "Act like you just won the lottery 💰",
  "Try to whistle a song 🎶",
  "Pretend you're in a horror movie 😱",
  "Say a tongue twister 3 times fast 🗣️",
  "Spin around 10 times and walk straight 😵",
  "Do your best superhero pose 🦸",
  "Act like a dog for 1 minute 🐶",
  "Try to touch your nose with your tongue 😝",
  "Do a slow-motion run 🐢",
  "Speak in rhymes for 1 minute 🎶",
  "Act like a news reporter 📰",
  "Pretend your phone is your girlfriend 😂",
  "Walk like a penguin 🐧",
  "Do 5 pushups right now 💪",
  "Act like you’re in a dance competition 💃",
  "Make a rap about your friend 🎤",
  "Pretend to be a statue 🗿",
  "Do your funniest laugh 😂",
  "Act like a villain 😈",
  "Pretend to eat invisible food 🍔",
  "Talk like a pirate 🏴‍☠️",
  "Do a dramatic movie scene 🎬",
  "Try to balance on one leg for 30 seconds 🦵",
  "Act like a teacher taking attendance 📚",
  "Do your best animal impression 🐘",
  "Pretend to be scared of everything 😱",
  "Sing a nursery rhyme seriously 🎶",
  "Do a silly dance for 20 seconds 💃",
  "Act like a YouTuber intro 🎥"
];
const truth = [
  "What’s the most embarrassing thing you’ve done in public?",
  "Have you ever talked to yourself in the mirror?",
  "What’s your weirdest habit?",
  "Who was your first crush and why? 😏",
  "What’s the biggest lie you’ve ever told?",
  "Have you ever stalked someone on social media?",
  "What’s your most useless talent?",
  "What’s your guilty pleasure?",
  "Have you ever laughed at the wrong time?",
  "What’s the weirdest dream you’ve had?",
  "If you could swap lives with someone, who would it be?",
  "What’s something you’ve never told anyone?",
  "Have you ever pretended to like something?",
  "What’s the cringiest thing you’ve done?",
  "What’s your biggest fear?",
  "Have you ever sent a message to the wrong person?",
  "What’s the funniest thing you believed as a kid?",
  "What’s your worst fashion mistake?",
  "Who do you secretly admire?",
  "What’s your most awkward moment?",
  "Have you ever been caught doing something bad?",
  "What’s the silliest thing you’re afraid of?",
  "What’s your hidden talent?",
  "What’s the most childish thing you still do?",
  "If your life was a movie, what would it be called?",
  "What’s the strangest food you’ve ever eaten?",
  "Have you ever faked being sick?",
  "What’s your worst habit?",
  "What’s the weirdest thing you’ve googled?",
  "Have you ever laughed so hard you cried?",
  "What’s the most embarrassing photo of you?",
  "Have you ever been rejected?",
  "What’s your biggest pet peeve?",
  "Have you ever sung in the shower?",
  "What’s your favorite cringe song?",
  "What’s the worst gift you’ve ever received?",
  "Have you ever lied to your best friend?",
  "What’s your funniest nickname?",
  "Have you ever danced in public?",
  "What’s the weirdest thing you own?",
  "Have you ever tripped in public?",
  "What’s the funniest thing you’ve done recently?",
  "What’s your secret talent nobody knows?",
  "Have you ever copied in an exam?",
  "What’s the most random thing in your bag?",
  "What’s your biggest regret?",
  "Have you ever laughed during a serious moment?",
  "What’s the funniest joke you know?",
  "What’s your most awkward conversation?",
  "If you were invisible, what would you do?"
];


const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://shajan:shajan143@shajan.qr8qkzn.mongodb.net/?appName=Shajan").then(()=>{
  console.log("Database connected!!");
  
});

const GameSchema = new mongoose.Schema({
  room: String,
  players: Array,
  history: Array,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  }
});

const Game = mongoose.model("Game", GameSchema);

const io = new Server(server, { cors: { origin: "*" } });

let rooms = {};

io.on("connection", (socket) => {
  
  socket.on("join_room", async ({ room, name, avatar }) => {
    socket.join(room);

    socket.room = room;

    if (!rooms[room]) {
      rooms[room] = { players: [], turn: 0, history: [] };
    }

    rooms[room].players.push({ id: socket.id, name, avatar, score: 0 });

    io.to(room).emit("update", rooms[room]);
  });

  const segments = ["Truth", "Dare", "Truth", "Dare", "Truth", "Dare"];
 const segmentAngle = 360 / segments.length;

  socket.on("spin", (room) => {
    const game = rooms[room];
    if (!game) return;

    const randomIndex = Math.floor(Math.random() * game.players.length);
    const player = game.players[randomIndex];

    
    const isTruth = Math.random() > 0.5;
    const randomdareIndex = Math.floor(Math.random() * dare.length);
    const singledare = dare[randomdareIndex];
    const randomtruthIndex = Math.floor(Math.random() * truth.length);
    const singletruth = truth[randomtruthIndex];
    const question = isTruth ? singletruth : singledare;
    
    const index = Math.floor(Math.random() * segments.length);
    const stopAngle = 360 - (index * segmentAngle) - (segmentAngle / 2);
    const spinAngle = 360 * 5 + stopAngle;


    const result = { type: isTruth ? "Truth" : "Dare", question, player, angle: spinAngle };

    game.history.push(result);

    io.to(room).emit("spin_result", result);
  });

  socket.on("complete", async ({ room, givescore }) => {
    const game = rooms[room];
    
    const player = game.players.find(p => p.name === givescore);
    if (player) player.score += 10;

    game.turn = (game.turn + 1) % game.players.length;

    await Game.findOneAndUpdate(
      { room },
      { players: game.players, history: game.history },
      { upsert: true }
    );

    io.to(room).emit("update", game);
  });

  socket.on("disconnect", () => {

  const room = socket.room;

  if (!room || !rooms[room]) return;

  rooms[room].players = rooms[room].players.filter(
    player => player.id !== socket.id
  );

  if (rooms[room].players.length === 0) {
    delete rooms[room];
  } else {
    io.to(room).emit("update", rooms[room]);
  }

});

  socket.on("emoji", ({ room, emoji }) => {
    io.to(room).emit("emoji", emoji);
  });

  socket.on("send_message", ({ room, name, message }) => {
  const msgData = {
    name,
    message,
    time: new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata"
  })
  };

  io.to(room).emit("receive_message", msgData);
});
});


server.listen(4000, ()=>{console.log("sever is running");
});
