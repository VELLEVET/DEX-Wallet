/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppNavigator} from './src/navigation/RootNavigator'
import {configureStore} from './src/configStore'
import {Provider} from 'react-redux'

const store = configureStore();

export default class App extends Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <AppNavigator/>
            </Provider>
        );
    }
}

