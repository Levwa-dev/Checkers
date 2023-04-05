import React, { useState } from "react";
import styles from './winner.module.css'
import GameFieldComponent from "../game-field-component/GameField";

export default function Winner({winner, moves}) {
    const [reset, setReset] = useState(false)
    if(reset){
        return (
            <GameFieldComponent playerOne={'#fff'} playerTwo={'#000'}/>
        )
    }
    return (
        <section className={styles.winnerBody}>
            <div>
                <h2>Перемога - {winner === '#fff' ? 'Білих' : "Чорних"}</h2>
                <p>Кількість ходів - {moves}</p>
                <button onClick={()=>setReset(true)}>Розпочати спочатку</button>
            </div>
        </section>
    )
}