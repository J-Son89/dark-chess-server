const crypto = require('crypto');
const {findIndex} = require('lodash');

const findActiveGameIndex = (games, playerId)=> 
  findIndex(games, ({blackTeamId, whiteTeamId, winningTeam}) =>
   (blackTeamId === playerId || whiteTeamId === playerId) && !winningTeam)

const generateKey = function() {
  var sha = crypto.createHash('sha256');
  sha.update(Math.random().toString());
  return sha.digest('hex');
};

const findIndexByGameId = (games, currentGameId) => findIndex(games, ({gameId}) => gameId === currentGameId )

module.exports = {
  findActiveGameIndex,
  generateKey,
  findIndexByGameId
}