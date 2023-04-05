export default class GameField {
    constructor () {
        this.cellCountHorizontaly = 8
        this.cellCountVerticaly = 8
        this.fieldArray = []
    }

    initGameField () {
        for(let i = 0; i < this.cellCountHorizontaly; i++){
            this.fieldArray.push([])

            for(let j = 0; j < this.cellCountVerticaly; j++) {
                if(i % 2 === 0 || i === 0){
                    j % 2 === 0 ?
                        this.fieldArray[i].push(0)
                        :
                        this.fieldArray[i].push(1)     
                }
                else{
                    j % 2 !== 0 ?
                        this.fieldArray[i].push(0)
                        :
                        this.fieldArray[i].push(1)     
                }
            }
        }
        return this.fieldArray
    }

    findInitialPositionForCheckers (firstClass, secondClass) {
        const chekersPostions = []
        for(let i = 0; i < this.fieldArray.length; i++){
            if(i === 3 || i === 4) continue
        
            for(let j = 0; j < this.fieldArray[i].length; j++) {
                if(this.fieldArray[i][j] === 1){
                    i <= 3 ?
                        chekersPostions.push(new firstClass({i, j}))
                        :
                        chekersPostions.push(new secondClass({i, j}))
                }
            }
        }
        return chekersPostions
    }

}