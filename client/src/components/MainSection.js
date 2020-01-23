import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client'
import Button from '@material-ui/core/Button'

const mainSocket = io('/555');
export default function MainSection()
{
    const [paintGrid, updatePaintGrid] = useState([])
    const socketRoute = useSelector(state => state.navState.socketRoute)
    const [room, updateRoom] = useState()
    const dispatch = useDispatch()

const createNewRoom = async () => {
    dispatch({type: 'saga-create-socket-pusher'})
}

    const changeColor = (y, x) => {
        let newGrid = JSON.parse(JSON.stringify(paintGrid))
        if (newGrid[y][x] === '#fc2403')
            newGrid[y][x] = '#ffffff'
        else
            newGrid[y][x] = '#fc2403'
        updatePaintGrid(newGrid)
        shareGrid(newGrid)
        //sendPaintGrid(newGrid)
    }

    const shareGrid = (grid) => {
        mainSocket.emit('send-grid', JSON.stringify(grid))
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
        mainSocket.on('updated-grid', (message) => updatePaintGrid(JSON.parse(message)))
        buildGrid()
    },[])

    useEffect(() => {
        console.log("SOCKET NUMBER: ", socketRoute)
    },[socketRoute])


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
            <Button onClick={() => createNewRoom()} variant="contained" color="primary" >HEello</Button>
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