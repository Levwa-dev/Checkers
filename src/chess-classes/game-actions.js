export default class GameActions {
    // Перевіряємо, чи вільна потрібна клітинка від інших шашок
    getCheckerInThatPosition({i, j}, checkerPosition){
        return checkerPosition.find(item=>item.position.i === i && item.position.j === j)
    }

    // Якщо клітинка вільна додаємо її позицію, якщо клітинка зайнята,
    // додаємо шашку, яка займає клітинку
    insertPosition (position, checker, array, selectedColor) {
        if(checker === undefined) array.push(position)
        else if(checker.color !== selectedColor) array.push(checker)
    }

    // Якщо шашка не нашого кольору, повертаємо її.
    // Якщо шашка нашого кольору, обрізаємо координати нижчих клітин
    // Якщо шашка комп'ютера, обрізаємо координати верхніх клітин 
    removeRedundantPositions (array, position, color, selectedColor, king) {
        if(!king){
            return array.filter(item => {
                if(item.hasOwnProperty('color')) return item
                if(color === "#fff") return item.i < position.i
                return item.i > position.i
            })
        }
        return array
    }

    getPositionsForKing (position, color, checkersPositions) {
        let nextPositions = []
        // Розрахунок наступної позиціїї для кожної діагоналі
        const nextLeftTopStep = (i, j) => ({i:i-1, j:j-1})
        const nextLeftBottomStep = (i, j) => ({i:i-1, j:j+1})
        const nextRightTopStep = (i, j) => ({i:i+1, j:j-1})
        const nextRightBottomStep = (i, j) => ({i:i+1, j:j+1})

        // Рекурсивна функція яка повертає необхідні позиції
        const getPositions = ({i, j}, nextStep, color, checkersPositions, maxI, maxJ ) => {
            const possiblePosition = nextStep(i, j)
            const checkerInThatPosition = this.getCheckerInThatPosition(possiblePosition, checkersPositions)
            // Якщо закінчилось поле 
            if(i === maxI || j === maxJ) {
                this.insertPosition(possiblePosition, checkerInThatPosition, nextPositions, color)
                return
            }
            // Якщо вперлись в іншу шашку
            if(checkerInThatPosition !== undefined && checkerInThatPosition.hasOwnProperty('color')) {
                this.insertPosition(possiblePosition, checkerInThatPosition, nextPositions, color)
                return
            }
            // Якщо клітинка пуста
            this.insertPosition(possiblePosition, checkerInThatPosition, nextPositions, color)
            return getPositions(possiblePosition, nextStep, color, checkersPositions, maxI, maxJ)
        }
        
        getPositions({i:position.i, j:position.j}, nextLeftTopStep, color, checkersPositions, 0, 0)
        getPositions({i:position.i, j:position.j}, nextLeftBottomStep, color, checkersPositions, 0, 8)
        getPositions({i:position.i, j:position.j}, nextRightTopStep, color, checkersPositions, 8, 0)
        getPositions({i:position.i, j:position.j}, nextRightBottomStep, color, checkersPositions, 8, 8)

        return nextPositions
    }

    getPositionsForOrdinaryChecker (position, color, checkersPositions) {
        let nextPositions = []
         // Отримаємо всі пусті клітинки, або клітинки з ворожими шашками по діагоналі
        if(position.i + 1 < 8 && position.j - 1 >= 0 ) {
            const possiblePosition = {i:position.i + 1, j: position.j - 1}
            const checkerInThatPosition = this.getCheckerInThatPosition(possiblePosition, checkersPositions) 
            this.insertPosition(possiblePosition, checkerInThatPosition, nextPositions, color)
        }
        if(position.i + 1 < 8 && position.j + 1 < 8 ) {
            const possiblePosition = {i:position.i + 1, j: position.j + 1}
            const checkerInThatPosition = this.getCheckerInThatPosition(possiblePosition, checkersPositions) 
            this.insertPosition(possiblePosition, checkerInThatPosition, nextPositions, color)
        }
        if(position.i - 1 < 8 && position.j - 1 >= 0 ){
            const possiblePosition = {i:position.i - 1, j: position.j - 1}
            const checkerInThatPosition = this.getCheckerInThatPosition(possiblePosition, checkersPositions) 
            this.insertPosition(possiblePosition, checkerInThatPosition, nextPositions, color)
        }
        if(position.i - 1 < 8 && position.j + 1 < 8 ){
            const possiblePosition = {i:position.i - 1, j: position.j + 1}
            const checkerInThatPosition = this.getCheckerInThatPosition(possiblePosition, checkersPositions) 
            this.insertPosition(possiblePosition, checkerInThatPosition, nextPositions, color)
        }
        return nextPositions
    }

    setKingProperty (activeChecker, position) {
        if(activeChecker.color === '#fff' && position.i === 0) {
            activeChecker.setKing()
        }
        if(activeChecker.color === '#000' && position.i === 7) {
            activeChecker.setKing()
        }
    }

    getNextPositionForChecker ({position, color, king}, checkersPositions, selectedColor) {
        let nextPositions = []
        if(king){
            nextPositions = this.getPositionsForKing(position, color, checkersPositions)
        }
        else{ 
           nextPositions = this.getPositionsForOrdinaryChecker(position, color, checkersPositions)
        }
        nextPositions = this.removeRedundantPositions(nextPositions, position, color, selectedColor, king)
        nextPositions = this.getAtackPositions(position, nextPositions, checkersPositions)
        return nextPositions
    }

    // Отримуємо координати та шашку противника, яку можемо побити
    getAtackPositions ({i, j}, positions, checkersPositions) {
        const atackPositions = []
        for(let {position, color} of positions) {
            if(color !== undefined){
                const newPosition = {}
                if(position.i < i && position.j > j && position.i - 1 >= 0 && position.j + 1 < 8) {
                    newPosition.i = position.i - 1
                    newPosition.j = position.j + 1
                }
                else if(position.i < i && position.j < j && position.i - 1 >= 0 && position.j - 1 >= 0) {
                    newPosition.i = position.i - 1
                    newPosition.j = position.j - 1
                }
                else if(position.i > i && position.j > j && position.i + 1 < 8 && position.j + 1 < 8) {
                    newPosition.i = position.i + 1
                    newPosition.j = position.j + 1
                }
                else if(position.i > i && position.j < j && position.i + 1 < 8 && position.j - 1 >= 0) {
                    newPosition.i = position.i + 1
                    newPosition.j = position.j - 1
                }
                if(newPosition.hasOwnProperty('i') && this.getCheckerInThatPosition(newPosition, checkersPositions) === undefined){
                    atackPositions.push({i: newPosition.i, j: newPosition.j, enemyColor: color, enemyPosition: position})
                }    
            }
        }
        if(atackPositions.length){
            return atackPositions
        }
        return positions.filter(item=>item.color === undefined)
    }

    atack (checkersPositions, {enemyPosition}) {
        return checkersPositions.filter(item => {
            if(JSON.stringify(item.position) !== JSON.stringify(enemyPosition)){
                return item
            }
            return null
        })
    }

    checkFight (checkersPositions, playerCheckers, selectedColor) {
        const positions = []
        for(let playerChecker of playerCheckers) {
            const position = this.getNextPositionForChecker(playerChecker, checkersPositions, selectedColor)
            if(position.length && position[0].hasOwnProperty('enemyColor')) {
                positions.push(playerChecker)
            }
        }
        return positions
    }

    getAllMovesForPlayersChecker (playerCheckers, checkersPositions, selectedColor) {
        let moves = []
        for(let checker of playerCheckers) {
            const position = this.getNextPositionForChecker(checker, checkersPositions, selectedColor)
            if(position.length) {
                moves.push({checker, position})
            }
        }
        return moves
    }

    hasWon(checkers, selectedColor) {
        const oponentCheckers = checkers.filter(item => item.color !== selectedColor)
        const oponentMoves = this.getAllMovesForPlayersChecker(oponentCheckers, checkers, selectedColor)

        if(!oponentCheckers.length || !oponentMoves.length) {
            return selectedColor
        }
        return false
    }

    continuePlayerMove (newCheckersPositions, oldCheckersPositions, checker, selectedColor) {
        const possiblePositions = this.getNextPositionForChecker(checker, newCheckersPositions, selectedColor)
        if(newCheckersPositions.length !== oldCheckersPositions.length && possiblePositions.length && possiblePositions[0].hasOwnProperty('enemyColor')) {
            return true
        }
        return false
    }
}