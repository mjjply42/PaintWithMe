import { call, all, put, takeLatest } from 'redux-saga/effects'
import { Buffer } from 'buffer'
import config from '../utils/config.json'

//const delay = (ms) => new Promise(res => setTimeout(res, ms))

function socketCreate() {
    return fetch(`${config.SOCKET_CREATE_API_URL}`, {
        method: 'GET',})  
}

function* setNewSocketConnection() {
    let response = yield call (socketCreate)
    let result = yield response.json()

    yield put({ type: 'store-created-socket', data: result})
}

function* getNewSocketConnection() {
    yield takeLatest('saga-create-socket-pusher', setNewSocketConnection)
}

export default function* rootSaga() {
    yield all([
        getNewSocketConnection(),
    ]);
}