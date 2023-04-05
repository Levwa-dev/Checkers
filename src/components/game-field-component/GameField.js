import React, { useEffect, useState } from "react";
import styles from "./game-field.module.css" 

import crown from '../../images/crown.png'
import moveSound from '../../sound/moveSound.mp3'
import atackSound from '../../sound/atack.mp3'

import GameField from "../../chess-classes/game-field";
import Statistics from "../statistics-component/Statistics";
import Winner from "../winner-component/Winner";

import { DarkChecker, WhiteChecker } from "../../chess-classes/checker";
import GameActions from "../../chess-classes/game-actions";

import { helperService } from "../../helpers/helper-service";

export default function GameFieldComponent ({playerOne, playerTwo}) {
    const [selectedColor, setSelectedColor] = useState(playerOne)
    const [field, setField] = useState('')
    const [gameAction, setGameAction] = useState('')
    const [checkers, setCheckers] = useState([])
    const [activeChecker, setActiveChecker] = useState({})
    const [nextCheckerPosition, setNextCheckerPosition] = useState([])
    const [numberOfMovements, setNumberOfMovements] = useState(0)
    const [winner, setWinner] = useState('')

    const chooseChecker = (checker, checkerPosition) => (e) => {
        if(checker.color !== selectedColor) return
        if(helperService.checkIfFight(checkers, checker, selectedColor, gameAction)) return
        helperService.addActiveBorder(e.target, 'activeChecker')
        const position = gameAction.getNextPositionForChecker(checker, checkerPosition, selectedColor)
        setNextCheckerPosition(position)
        setActiveChecker(checker)
    }

    const chooseNewPosition = (position) => () => {
        let newCheckersPositions = checkers
        const sound = new Audio(moveSound)
        sound.play()

        newCheckersPositions = helperService.atackEnemy(position, gameAction, checkers, newCheckersPositions, atackSound)
        gameAction.setKingProperty(activeChecker, position)
        activeChecker.changeCheckerPosition(position)

        if(gameAction.hasWon(newCheckersPositions, selectedColor)) {
            setWinner(gameAction.hasWon(newCheckersPositions, selectedColor))
        }
        if(!gameAction.continuePlayerMove(newCheckersPositions, checkers, activeChecker, selectedColor)) {
            selectedColor === playerOne ?
                setSelectedColor(playerTwo)
                :
                setSelectedColor(playerOne)
            setActiveChecker({})
            setNextCheckerPosition([])
            setCheckers(newCheckersPositions)
            setNumberOfMovements(numberOfMovements + 1)
            return
        }
        const positions = gameAction.getNextPositionForChecker(activeChecker, newCheckersPositions, selectedColor)
        setNextCheckerPosition(positions)
        setCheckers(newCheckersPositions)
        setNumberOfMovements(numberOfMovements + 1)
    }


    useEffect(()=>{
        const field = new GameField()
        const gameAction = new GameActions()
        const emptyField = field.initGameField()
        let checkerPosition = field.findInitialPositionForCheckers(DarkChecker, WhiteChecker)
        setGameAction(gameAction)
        setCheckers(checkerPosition)
        setField(emptyField)
    },[])

    if(winner){
        return (
            <Winner winner={winner} moves={numberOfMovements} />
        )
    }
    return (
        <section className={styles.chess}>
            <Statistics numberOfMovements = {numberOfMovements} checkers = {checkers} selectedColor={selectedColor}>
                <div className={styles.field}>
                    {field && field.map((hLine, hIndex) => {
                        return(
                            <div className={styles.verticalLine} key={hIndex}>
                                {hLine.map((vLine, vIndex) => {
                                    return(
                                        <div style={vLine ? {backgroundColor:'#994d00'}: {backgroundColor:"#ffe5cc"}} className="cell" key={vIndex}>
                                            { nextCheckerPosition && nextCheckerPosition.map((item, index)=>{
                                                if(item.i === hIndex && item.j === vIndex){
                                                    return (
                                                        <div key={index} onClick={chooseNewPosition(item)} className={styles.nextPostion}></div>
                                                    )
                                                }
                                                return null
                                            })
                                            }
                                            { checkers.map((item, index)=>{
                                                if(item.position.i === hIndex && item.position.j === vIndex){
                                                    return (
                                                        <div onClick={chooseChecker(item, checkers)} key={index} style={{backgroundColor:item.color}} className="checker">
                                                            { item.king &&
                                                                <img className={styles.crown} src={crown} alt="King"/>
                                                            }
                                                        </div>
                                                    )
                                                }
                                                return null
                                            })
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                            )
                        })
                    }
                </div>
            </Statistics>
        </section>
    )
}