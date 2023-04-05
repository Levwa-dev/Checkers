import React, { useEffect, useState } from "react";
import styles from './statistics.module.css'

export default function Statistics ({numberOfMovements, checkers, children, selectedColor}) {
    const [checkerCount, setCheckerCount] = useState({white:0, black:0})

    useEffect(()=>{
        if(checkers.length){
            const blackChekers = checkers.filter(item => item.color === '#000').length
            const whiteCheckers = checkers.filter(item => item.color === '#fff').length
            setCheckerCount({white:whiteCheckers, black:blackChekers})
        }
    }, [checkers])

    return (
        <section>
            <div className={styles.container}>
                <h2>Хід: {numberOfMovements}</h2>
                <h2>Білих: {checkerCount.white}/12</h2>
                <h2>Чорних: {checkerCount.black}/12</h2>
            </div>
            <div className={styles.fieldWrappper}>
                <section className={styles.player}>
                    <span>Гравець</span>
                    <div style={{backgroundColor:"#994d00"}} className="cell">
                        <div style={{backgroundColor:"#fff"}} className="checker"></div>
                    </div>
                    {selectedColor !== "#fff" ? <div className={styles.curtain}></div>: null}
                </section>
                {children}
                <section className={styles.player}>
                    <span>Гравець</span>
                    <div style={{backgroundColor:"#994d00"}} className="cell">
                        <div style={{backgroundColor:"#000"}} className="checker"></div>
                    </div>
                    {selectedColor !== "#000" ? <div className={styles.curtain}></div>: null}
                </section>
            </div>
        </section>
    )
}