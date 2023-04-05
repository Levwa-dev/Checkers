import React, { useState } from "react";
import GameFieldComponent from "../game-field-component/GameField";
import styles from "./start-screen.module.css"

export default function StartScreen () {
    const [start, setStart] = useState(false)

    return (
        <main className={styles.chessBody}>
            <h1 className={styles.title}>Шашки</h1>
            <div className={styles.container}>
                { start ?
                    <GameFieldComponent playerOne={'#fff'} playerTwo={'#000'}/>
                    :
                    <button onClick={()=>setStart(true)}>Розпочати гру</button>
                }
            </div>
        </main>
    )
}