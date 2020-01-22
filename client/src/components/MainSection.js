import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const fullDomain = `${window.location.protocol}//${window.location.hostname}:${process.env.PORT || 5000}`
console.log(fullDomain)
const socket = io('/turd');
export default function MainSection()
{
    const [paintGrid, updatePaintGrid] = useState([])

    const changeColor = (y, x) => {
        let newGrid = JSON.parse(JSON.stringify(paintGrid))
        if (newGrid[y][x] === '#fc2403')
            newGrid[y][x] = '#ffffff'
        else
            newGrid[y][x] = '#fc2403'
        updatePaintGrid(newGrid)
        serverTest(newGrid)
        //sendPaintGrid(newGrid)
    }

    const serverTest = (grid) => {
        socket.emit('test-send', JSON.stringify(grid))
    }

    const buildGrid = () => {
        let outer_arr = new Array([])
        let inner_arr = []
        let i = 88
        let j = 100
        while (i > 0)
        {
            j = 10
            while (j > 0)
            {
                inner_arr.push('#ffffff')
                j--
            }
            outer_arr.push(inner_arr)
            inner_arr = []
            i--
        }
        outer_arr.shift()
        updatePaintGrid(outer_arr)
    }

    useEffect(() => {
        console.log(window.location.origin)
        buildGrid()
        socket.on('test-response', (message) => updatePaintGrid(JSON.parse(message)))
    },[])


    return (
        <div style={styles.mainOuterDiv}>
            <div style={styles.mainInnerDiv}>
                <div style={styles.paintGrid}>
                    {paintGrid.map((arr, y) => {
                        return (<>
                        {arr.map((item, x) => {
                            return (<div onClick={() => {
                                changeColor(y,x)
                            }} style={{ width: 20,
                                height: 20,
                                background: (item)}}></div>)
                        })}
                        </>)
                    })}
                </div>
            </div>
        </div>
    )
}

const styles = {
    mainOuterDiv: {
        width: '100%',
        height: window.innerHeight,
        background: ' #282c34',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainInnerDiv: {
        width: (window.innerWidth - 100),
        height: (window.innerHeight - 220),
        background: 'white',
    },
    paintGrid: {
        width: '100%',
        height: '100%',
        background: 'pink',
        display: 'flex',
        flexWrap: 'wrap',
    },
    gridItem: {
    }
}