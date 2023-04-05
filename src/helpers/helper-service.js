export const helperService = {
    checkIfFight (checkers, checker, selectedColor, gameAction) {
        const playerCheckers = checkers.filter(item=>item.color === selectedColor)
        const fightPositions = gameAction.checkFight(checkers, playerCheckers, selectedColor)
        if(fightPositions.length && fightPositions.map(item=>item.position).indexOf(checker.position) === -1){
           return true
        }
        return false
    },

    addActiveBorder (target, className) {
        const activeCheckers = document.querySelectorAll(`.${className}`)
        for(let activeChecker of activeCheckers){
            activeChecker.classList.remove(className)
        }
        target.classList.add(className)
    },

    atackEnemy (position, gameAction, checkers, array, atackSound) {
        if(position.hasOwnProperty('enemyPosition')){
            const sound = new Audio(atackSound)
            sound.play()
            return gameAction.atack(checkers, position)
        }
        return array
    },
    
}