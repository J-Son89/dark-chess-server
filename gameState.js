const minutesMap = {
  10: 600000,
  15: 900000,
  30: 1800000,
};

const initialGameState = {
  gameMoves: [],
  blackTeamId: undefined,
  whiteTeamId: undefined,
  currentPlayerInCheck: false,
  blacksTurn: false,
  blackTeamId: undefined,
  whiteTeamId: undefined,
  winningTeam: undefined,
  gameStarted: false,
  turnNumber: 0,
  turnTimeStamp: undefined,
  remainingTime: {
    white: minutesMap[15],
    black: minutesMap[15],
  },
  gameStage: 1,
  modal: {
    isModalOpen: false,
    currentPawn: "",
    currentPawnPosition: "",
  },
  piecesTaken: [],
  boardState: {
    "00": "blackRook00",
    "01": "blackKnight01",
    "02": "blackBishop02",
    "03": "blackQueen03",
    "04": "blackKing04",
    "05": "blackBishop05",
    "06": "blackKnight06",
    "07": "blackRook07",
    "10": "blackPawn10",
    "11": "blackPawn11",
    "12": "blackPawn12",
    "13": "blackPawn13",
    "14": "blackPawn14",
    "15": "blackPawn15",
    "16": "blackPawn16",
    "17": "blackPawn17",
    "60": "whitePawn60",
    "61": "whitePawn61",
    "62": "whitePawn62",
    "63": "whitePawn63",
    "64": "whitePawn64",
    "65": "whitePawn65",
    "66": "whitePawn66",
    "67": "whitePawn67",
    "70": "whiteRook70",
    "71": "whiteKnight71",
    "72": "whiteBishop72",
    "73": "whiteQueen73",
    "74": "whiteKing74",
    "75": "whiteBishop75",
    "76": "whiteKnight76",
    "77": "whiteRook77",
  },
  piecePositions: {
    blackRook00: { currentPosition: "00", hasMoved: false },
    blackKnight01: { currentPosition: "01", hasMoved: false },
    blackBishop02: { currentPosition: "02", hasMoved: false },
    blackQueen03: { currentPosition: "03", hasMoved: false },
    blackKing04: { currentPosition: "04", hasMoved: false },
    blackBishop05: { currentPosition: "05", hasMoved: false },
    blackKnight06: { currentPosition: "06", hasMoved: false },
    blackRook07: { currentPosition: "07", hasMoved: false },
    blackPawn10: { currentPosition: "10", hasMoved: false },
    blackPawn11: { currentPosition: "11", hasMoved: false },
    blackPawn12: { currentPosition: "12", hasMoved: false },
    blackPawn13: { currentPosition: "13", hasMoved: false },
    blackPawn14: { currentPosition: "14", hasMoved: false },
    blackPawn15: { currentPosition: "15", hasMoved: false },
    blackPawn16: { currentPosition: "16", hasMoved: false },
    blackPawn17: { currentPosition: "17", hasMoved: false },
    whitePawn60: { currentPosition: "60", hasMoved: false },
    whitePawn61: { currentPosition: "61", hasMoved: false },
    whitePawn62: { currentPosition: "62", hasMoved: false },
    whitePawn63: { currentPosition: "63", hasMoved: false },
    whitePawn64: { currentPosition: "64", hasMoved: false },
    whitePawn65: { currentPosition: "65", hasMoved: false },
    whitePawn66: { currentPosition: "66", hasMoved: false },
    whitePawn67: { currentPosition: "67", hasMoved: false },
    whiteRook70: { currentPosition: "70", hasMoved: false },
    whiteKnight71: { currentPosition: "71", hasMoved: false },
    whiteBishop72: { currentPosition: "72", hasMoved: false },
    whiteQueen73: { currentPosition: "73", hasMoved: false },
    whiteKing74: { currentPosition: "74", hasMoved: false },
    whiteBishop75: { currentPosition: "75", hasMoved: false },
    whiteKnight76: { currentPosition: "76", hasMoved: false },
    whiteRook77: { currentPosition: "77", hasMoved: false },
  },
  ghostBoardState: {
    "00": "ghostblackRook00",
    "01": "ghostblackKnight01",
    "02": "ghostblackBishop02",
    "03": "ghostblackQueen03",
    "04": "ghostblackKing04",
    "05": "ghostblackBishop05",
    "06": "ghostblackKnight06",
    "07": "ghostblackRook07",
    "10": "ghostblackPawn10",
    "11": "ghostblackPawn11",
    "12": "ghostblackPawn12",
    "13": "ghostblackPawn13",
    "14": "ghostblackPawn14",
    "15": "ghostblackPawn15",
    "16": "ghostblackPawn16",
    "17": "ghostblackPawn17",
    "60": "ghostwhitePawn60",
    "61": "ghostwhitePawn61",
    "62": "ghostwhitePawn62",
    "63": "ghostwhitePawn63",
    "64": "ghostwhitePawn64",
    "65": "ghostwhitePawn65",
    "66": "ghostwhitePawn66",
    "67": "ghostwhitePawn67",
    "70": "ghostwhiteRook70",
    "71": "ghostwhiteKnight71",
    "72": "ghostwhiteBishop72",
    "73": "ghostwhiteQueen73",
    "74": "ghostwhiteKing74",
    "75": "ghostwhiteBishop75",
    "76": "ghostwhiteKnight76",
    "77": "ghostwhiteRook77",
  },
  ghostPiecePositions: {
    ghostblackRook00: "00",
    ghostblackKnight01: "01",
    ghostblackBishop02: "02",
    ghostblackQueen03: "03",
    ghostblackKing04: "04",
    ghostblackBishop05: "05",
    ghostblackKnight06: "06",
    ghostblackRook07: "07",
    ghostblackPawn10: "10",
    ghostblackPawn11: "11",
    ghostblackPawn12: "12",
    ghostblackPawn13: "13",
    ghostblackPawn14: "14",
    ghostblackPawn15: "15",
    ghostblackPawn16: "16",
    ghostblackPawn17: "17",
    ghostwhitePawn60: "60",
    ghostwhitePawn61: "61",
    ghostwhitePawn62: "62",
    ghostwhitePawn63: "63",
    ghostwhitePawn64: "64",
    ghostwhitePawn65: "65",
    ghostwhitePawn66: "66",
    ghostwhitePawn67: "67",
    ghostwhiteRook70: "70",
    ghostwhiteKnight71: "71",
    ghostwhiteBishop72: "72",
    ghostwhiteQueen73: "73",
    ghostwhiteKing74: "74",
    ghostwhiteBishop75: "75",
    ghostwhiteKnight76: "76",
    ghostwhiteRook77: "77",
  },
};

module.exports = initialGameState;
