// @flow

import React, {Component} from "react";
import {Text, View} from "react-native";


type Props = {}
export default  class Loading extends Component<Props> {
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text
                    style={{
                        color: "#2F4F4F",
                        fontSize: 45,
                        fontWeight: "bold"
                    }}
                >
                    DEX Wallet
                </Text>
                <Text style={{ fontSize: 18 }}>loading...</Text>
            </View>
        );
    }
}
