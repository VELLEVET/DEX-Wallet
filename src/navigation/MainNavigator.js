import {createStackNavigator} from 'react-navigation'

import Main from '../screens/Main'
import CoinDetail from '../screens/CoinDetail'

export default createStackNavigator({
        Main: {
            screen: Main
        },
        CoinDetail: {
            screen: CoinDetail
        },


    }, {
        navigationOptions: {
            header: null
        }
    }
)
