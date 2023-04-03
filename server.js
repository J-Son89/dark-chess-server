const express = require("express");
const initialGameState = require("./gameState");
const app = express();
const { cloneDeep } = require("lodash");
const {
  generateKey,
  findActiveGameIndex,
  findIndexByGameId,
} = require("./util");
const querystring = require("querystring");
const router = express.Router();
var bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const io = require("socket.io")(http);
io.set("origins", "*:*");

const port = process.env.PORT || 5000;

const games = [];
const newGame = (gameId) => ({
  gameId: gameId ? gameId : generateKey(),
  ...cloneDeep(initialGameState),
});

const gameOne = newGame();
games.unshift(gameOne);

const state = {
  gameNumber: 0,
  nextGameId: gameOne.gameId,
};

app.get("/", (request, response) => {
  response.send("Hello from Express!");
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(function (req, res, next) {
  express.json();
  bodyParser.json();
  next();
});

app.get("/initialGameState", async function (req, res) {
  await res.send({ initialGameState });
});

app.get("/currentGameState", async function (req, res) {
  const [url, params] = req.url.split("?");
  const { playerId } = querystring.parse(params);
  const index = findActiveGameIndex(games, playerId);
  await res.send({ currentGameState: games[index] });
});

app.post("/joinGame", async function (req, res) {
  const newPlayerId = generateKey();
  await res.send({ newPlayerId });
});

const server = http.createServer({}, app).listen(port, () => {
  console.log("server running at " + port);
});

io.listen(server);

io.on("connection", (client) => {
  client.on("playerReadyToStartGame", async (playerId, privateGameId) => {
    const isPlayerInActiveGame = games.some(
      ({ blackTeamId, whiteTeamId, winningTeam }) => {
        return (
          (blackTeamId === playerId || whiteTeamId === playerId) && !winningTeam
        );
      }
    );
    if (isPlayerInActiveGame) {
      return;
    }
    if (privateGameId) {
      if (findIndexByGameId(games, privateGameId) === -1) {
        await createNewPrivateGame(privateGameId);
      }
      const privateGameIndex = findIndexByGameId(games, privateGameId);

      const { gameId, blackTeamId, whiteTeamId } = games[privateGameIndex];
      if (!blackTeamId) {
        setBlackTeamId(privateGameIndex, playerId);
        client.emit("playerJoinedAndWaiting", games[privateGameIndex]);
        client.join(gameId);
      } else if (!whiteTeamId) {
        setWhiteTeamId(privateGameIndex, playerId);
        client.join(gameId);
      }

      if (
        games[privateGameIndex].blackTeamId &&
        games[privateGameIndex].whiteTeamId
      ) {
        setGameStarted(privateGameIndex);
        io.to(gameId).emit("startGame", games[privateGameIndex]);
      }
      return;
    }

    const newGameIndex = state.gameNumber;
    const { gameId, blackTeamId, whiteTeamId } = games[newGameIndex];
    if (!blackTeamId) {
      setBlackTeamId(newGameIndex, playerId);
      client.emit("playerJoinedAndWaiting", games[newGameIndex]);
      client.join(gameId);
    } else if (!whiteTeamId) {
      client.emit("playerJoinedAndWaiting", games[newGameIndex]);
      setWhiteTeamId(newGameIndex, playerId);
      client.join(gameId);
    }

    if (games[newGameIndex].blackTeamId && games[newGameIndex].whiteTeamId) {
      setGameStarted(newGameIndex);
      io.to(gameId).emit("startGame", games[newGameIndex]);
      createNewGame();
    }
  });

  client.on("movePiece", (newState) => {
    const index = findIndexByGameId(games, newState.gameId);
    games[index] = newState;
    const { gameId } = games[index];
    if (newState.winningTeam) {
      io.to(gameId).emit("gameOver", games[index]);
    } else {
      updateTimeStamp(index);
      io.to(gameId).emit("pieceMoved", games[index]);
    }
  });

  client.on("rejoinGame", (playerId) => {
    const index = findActiveGameIndex(games, playerId);
    if (index === -1) {
      client.emit("noGameToRejoin");
    } else {
      client.join(games[index].gameId);
      client.emit("gameRejoined", games[index]);
    }
  });

  client.on("forfeitGame", (playerId) => {
    const index = findActiveGameIndex(games, playerId);
    if (index === -1) {
      return;
    }
    const { gameId, blackTeamId, whiteTeamId } = games[index];
    if (blackTeamId === playerId) {
      setWinnersAsWhiteTeam(index);
    } else if (whiteTeamId === playerId) {
      setWinnersAsBlackTeam(index);
    }
    setGameStopped(index);
    games[index].gameStarted = false;
    io.to(gameId).emit("gameOver", games[index]);
  });

  client.on("leaveCurrentGame", (state) => {
    client.leave(state.gameId);
  });
});

const setBlackTeamId = (index, playerId) =>
  (games[index].blackTeamId = playerId);
const setWhiteTeamId = (index, playerId) =>
  (games[index].whiteTeamId = playerId);
const setGameStarted = (index) => {
  updateTimeStamp(index);
  games[index].gameStarted = true;
};
const updateTimeStamp = (index) => {
  games[index].turnTimeStamp = Date.now();
};
const setGameStopped = (index) => (games[index].gameStarted = false);
const setWinnersAsWhiteTeam = (index) => (games[index].winningTeam = "white");
const setWinnersAsBlackTeam = (index) => (games[index].winningTeam = "black");

const createNewPrivateGame = (gameId) =>
  new Promise((res) => {
    const nextGame = newGame(gameId);
    games.push(nextGame);
    res();
  });

const createNewGame = () => {
  const nextGame = newGame();
  state.gameNumber = games.length;
  games.push(nextGame);
  state.nextGameId = nextGame.gameId;
};
