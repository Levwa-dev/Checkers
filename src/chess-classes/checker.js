class Checher {
    constructor (position = '', king = false) {
        this.king = king
        this.position = position
    }

    changeCheckerPosition ({i, j}) {
        this.position = {i, j}
    }
    
    setKing () {
        this.king = true
    }

}

export class DarkChecker extends Checher {
    constructor (king, position) {
        super(king, position)
        this.color = '#000'
    }
}

export class WhiteChecker extends Checher {
    constructor (king, position) {
        super(king, position)
        this.color = '#fff'
    }
}