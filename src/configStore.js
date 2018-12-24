import {applyMiddleware, compose, createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import rootReducer from './reducers'
// import {navMiddleware} from './navigation/RootNavigator'
const logger = createLogger({
    predicate: (getState, action) => __DEV__,
    collapsed: true,
    duration: true,
})

const middlewares = [
    applyMiddleware(thunkMiddleware),
]

if (__DEV__) {
    middlewares.push(applyMiddleware(logger))
}
export const configureStore = () => {

    const store = compose(
        ...middlewares
    )(createStore)(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
    return store
}