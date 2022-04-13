interface Letter {
    index: number
    letter: string
    found: boolean
    misplaced?: boolean
}

interface Word {
    letters: Letter[]
}

interface Player {
    id: string
    played: boolean
}

interface Game {
    word: Word
    players: Player[]
    currentPlayer: Player
    date: string
    limit: number
    finished: boolean
    history?: Word[]
}

export {
    Player,
    Game,
    Word,
    Letter
}