const defaultState = {
    socketRoute: ""
}

const navState = (state = defaultState, action) => {
    switch (action.type) {
        case 'saga-create-socket-pusher':
            return {
                ...state,
            }
        case 'store-created-socket':
            return {
                ...state,
                socketRoute: action.data
            }
        default:
            return state
    }
}

export default navState