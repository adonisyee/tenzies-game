import React from "react"
import "./css/styles.css";
import Die from "./Die";
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [numRolls, setNumRolls] = React.useState(0);
    const [minRolls, setMinRolls] = React.useState(() => JSON.parse(localStorage.getItem('minRolls')) || false)
    const [tenzies, setTenzies] = React.useState(false)

    React.useEffect(() => {
        if (dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)) {
            setTenzies(true)
            if (!minRolls || numRolls < minRolls) {
                setMinRolls(numRolls)
                localStorage.setItem('minRolls', minRolls)
            }
        }
    }, [dice, minRolls, numRolls])

    function generateNewDie() {
        return {
            id: nanoid(),
            value: Math.ceil(Math.random()*6),
            isHeld:false
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i=0; i<10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if (!tenzies) {
            setNumRolls(prevNumRolls => prevNumRolls + 1)
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ? die : generateNewDie()
            }))
        } else {
            setDice(allNewDice())
            setNumRolls(0)
            setTenzies(false)
        }
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map((die) => {
            return die.id === id ? {...die, isHeld: !die.isHeld} : die
        }))
    }

    const diceElements = dice.map((die)=> (<Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />))

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it as its current value between rolls.</p>
            <div className="die-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>{tenzies ? 'Reset Game' : 'Roll'}</button>
            <h2 className="numRolls">Number of Rolls: {numRolls}</h2>
            {minRolls && <h2 className="minRolls">High Score: {minRolls}</h2>}
        </main>
    )
}
