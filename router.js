const express = require('express');
const initialGameState = require('./gameState');
const {set, get} = require('lodash');
const app = express();
const router = express.Router();
const upload = require('./uploadMiddleware');

var crypto = require('crypto');

var generateKey = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

const state = {
  gameNumber:0,
  blackTeamId:undefined,
  whiteTeamId: undefined,
  gameState: initialGameState
}

router.get('/gameState', async function (req, res) {
  await res.send(generateKey());
});

router.post('./joinGame', x,async function (req, res) {
  const newPlayerId = generateKey();
  const path = !state.blackTeamId ? 'blackTeamId': 'whiteTeamId';
  const newState = set(state, [path], newPlayerId)
  await res.send(newState)
})

// TODO save game state in a db
router.post('/movePiece', newState, async function (req, res) {
  await console.log('movePiece', newState);
});

router.post('/startGame', playerId, async function (req, res) {
  await console.log('startGame', playerId);
  
});

router.post('/stopGame', winner, async function (req, res) {
  await console.log('stopGame', winner);
});

module.exports = router;
