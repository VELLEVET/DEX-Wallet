import {createStackNavigator, createBottomTabNavigator} from 'react-navigation'

import Main  from '../screens/Main'

import Tabs  from '../screens/Tabs'
import CoinDetail from '../screens/CoinDetail'
import Comission from '../screens/Comissions/Comission';

const HomeNav = createStackNavigator({
        Main: {
            screen: Tabs
        },
    }, {
        navigationOptions: {
            header: null
        }
    }
)
const SecondNav = createStackNavigator({
    Main: {
        screen: Comission
    },
}, {
    navigationOptions: {
        header: null,
    }
}
)
const ThirdNav = createStackNavigator({
    Main: {
        screen: Tabs
    },
}, {
    navigationOptions: {
        header: null
    }
}
)
export default createBottomTabNavigator({
    
    Home:{
        screen: HomeNav
    },
    Second: {
        screen: SecondNav
    },
    Thirds: {
        screen: ThirdNav
    }
})
