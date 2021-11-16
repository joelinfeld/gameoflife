import React, { useEffect, useState } from 'react'
import './app.css'

const WIDTH = 50
const HEIGHT = 50

const gridStyle = {
    display: 'grid',
    width: WIDTH * 21 - 1,
    gridTemplateColumns: `repeat(${WIDTH}, 20px)`,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    gridGap: 1,
    backgroundColor: 'black'
}

const cellAlive = {
    width: 20,
    height: 20,
    backgroundColor: 'white'
}

const cellDead = {
    width: 20,
    height: 20,
    backgroundColor: 'black'
}

const relativeIndexes = (row, col) => [
    [row-1, col-1], [row-1, col], [row-1, col+1],
    [row, col-1], [row, col+1],
    [row+1, col-1], [row+1, col], [row+1, col+1]
]

const check = (grid, coord) => {
    if (coord.some(e => (e < 0 || e >= WIDTH || e >= HEIGHT))) return 0
    if (grid[coord[0]][coord[1]]) return 1
    return 0
}

const genRule = (cur, liveCount) => {
    if ((!cur && liveCount === 3) || (cur && (liveCount > 3 || liveCount < 2))) return !cur
    return cur
}

const checkNeighbors = (grid) => {
    let updateGrid =  grid.map(row => [...row])
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            let liveCount = relativeIndexes(i, j).reduce((count, coord) => (
                count + check(grid, coord)
            ), 0)
            updateGrid[i][j] = genRule(grid[i][j], liveCount)
        })
    })
    return updateGrid
}

const seed = () => (
    Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(null).map(() => Math.random() < .2))
)

const App = () => {
    const [ grid, setGrid ] = useState(seed)

    console.log(grid)
    const incGen = (event) => {
        event.preventDefault()
        setGrid(checkNeighbors(grid))
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setGrid(checkNeighbors(grid))
        }, 100)
        return () => clearInterval(interval)
    })
    
    return (
    <div>
        <button onClick={incGen}>CLICK ME</button>
        <div style={gridStyle}>
            {grid.map((row, i) => row.map((col, j) => <div key={`${j},${i}`} style={grid[i][j] ? cellAlive : cellDead}></div>))}
        </div>
    </div>
    )
}

export default App