// @flow
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import MainNavigator from './MainNavigator'


export const AppNavigator =  createAppContainer( createSwitchNavigator(
    {
        // Loading,
        Main: MainNavigator,
    },
    {
        initialRouteName: 'Main'
    }
))
