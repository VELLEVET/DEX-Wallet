import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableHighlight
} from "react-native";
import { appStyle } from "./styles.js";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu"; // Version can be specified in package.json

const styles = StyleSheet.create(appStyle);

export class MyListItem extends Component {
  render() {
    let colorized = () => {
      let change = this.props.percent_change;
      if (change === "0%") {
        return (
          <Text style={{ color: "gray", fontSize: 14, alignSelf: "flex-end" }}>
            0.0%
          </Text>
        );
      } else if (change.includes("-")) {
        return (
          <Text style={{ color: "red", fontSize: 14, alignSelf: "flex-end" }}>
            {change}
          </Text>
        );
      } else {
        return (
          <Text style={{ color: "green", fontSize: 14, alignSelf: "flex-end" }}>
            +{change}
          </Text>
        );
      }
    };

    let title = this.props.title;

    let titleSplitter = () => {
      if (title.includes(".")) {
        let tit = title.split(".");
        return (
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              alignItems: "baseline",
              alignSelf: "stretch"
            }}
          >
            <Text
              style={{
                fontSize: 9
              }}
            >
              {tit[0]}
            </Text>
            <Text
              style={{
                fontWeight: "600",
                height: 18
              }}
            >
              .{tit[1]}
            </Text>
          </View>
        );
      } else {
        return (
          <View
            style={{
              flex: 2
            }}
          >
            <Text style={{ fontWeight: "600" }}>{title}</Text>
          </View>
        );
      }
    };

    return (
      <TouchableHighlight
        onPress={this.props.press}
        onLongPress={this.props.longpress}
        underlayColor="white"
      >
        <View style={this.props.style}>
          <View
            style={{
              flex: 2
            }}
          >
            {titleSplitter(title)}
            <View style={{ alignSelf: "flex-start" }}>
              <Text style={{ fontSize: 10 }}>
                {new Date(this.props.time).toLocaleTimeString()}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 4,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                marginEnd: 10,
                flex: 1.5
              }}
            >
              <Text style={{ fontSize: 14, alignSelf: "flex-end" }}>
                {this.props.latest}
              </Text>
              {colorized()}
            </View>
            <View
              style={{
                flex: 1.2,

                marginEnd: 10
              }}
            >
              <Text style={{ fontSize: 14, alignSelf: "flex-end" }}>
                {this.props.base_volume}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export class CustomMenu extends Component {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  render() {
    return (
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
        <TouchableHighlight onPress={this.props.func}>
          <Image
            style={{ width: 27, height: 27, marginEnd: 15 }}
            source={this.props.star}
          />
        </TouchableHighlight>
        <Menu
          ref={this.setMenuRef}
          button={
            <TouchableHighlight onPress={this.showMenu}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../img/menu.png")}
              />
            </TouchableHighlight>
          }
        >
          <MenuItem onPress={this.hideMenu}>Menu item 1</MenuItem>
          <MenuItem onPress={this.hideMenu}>Menu item 2</MenuItem>
          <MenuItem onPress={this.hideMenu} disabled>
            Bonus
          </MenuItem>
          <MenuDivider />
          <MenuItem onPress={this.hideMenu}>Menu item 4</MenuItem>
        </Menu>
      </View>
    );
  }
}

export class Footer extends Component {
  render() {
    let objects = this.props.items.map((item, index) => {
      return (
        <ImgButton
          imgstyle={{ width: 30, height: 30, margin: 5 }}
          key={index}
          id={index}
          source={item.req}
          func={item.func}
        />
      );
    });
    return <View style={styles.bottom_toolbar}>{objects}</View>;
  }
}

export class Loading extends Component {
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
            color: "burlywood",
            fontSize: 45,
            fontWeight: "bold"
          }}
        >
          DEX Wallet
        </Text>
        <Text
          style={{
            color: "#74270e",
            fontSize: 45,
            fontWeight: "bold",
            position: "absolute",
            top: 295,
            right: 92
          }}
        >
          DEX Wallet
        </Text>
        <Text style={{ fontSize: 18 }}>loading...</Text>
      </View>
    );
  }
}

export class SortBar extends Component {
  render() {
    let funct = this.props.func;
    let hoverbut = this.props.hoverbut;
    let buttons = ["Name", "Price", "Change", "Volume"];
    let buttMap = buttons.map((item, index) => {
      let txtstyle = { alignSelf: "center", color: "white" };
      if (index == hoverbut || index == hoverbut - 100)
        txtstyle.color = "yellow";
      if (index == 0) {
        txtstyle.alignSelf = "flex-start";
        txtstyle.marginStart = 8;
      }
      if (index == 1) {
        txtstyle.alignSelf = "flex-end";
        txtstyle.marginEnd = 5;
      }
      if (index == 2) {
        txtstyle.alignSelf = "flex-start";
        txtstyle.marginStart = 10;
      }
      if (index == 3) {
        txtstyle.alignSelf = "flex-end";
        txtstyle.marginEnd = 10;
      }
      if (hoverbut == index) {
        item = item + "▼";
      } else if (hoverbut - 100 == index) {
        item = item + "▲";
      }

      return (
        <TxtButton
          key={index}
          id={index}
          func={funct}
          style={{
            flex: 2
          }}
          text={item}
          textstyle={txtstyle}
        />
      );
    });

    return (
      <View
        style={{
          flex: 0,
          height: 30,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#1f3c03"
        }}
      >
        {buttMap}
      </View>
    );
  }
}
 
export class TxtButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={() => this.props.func(this.props.id)}
      >
        <Text style={this.props.textstyle}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

export class ImgButton extends Component {
  render() {
    let id = this.props.id;
    return (
      <TouchableOpacity
        style={this.props.touchstyle}
        onPress={
          id == undefined ? this.props.func : this.props.func(id)
        }
      >
        <Image style={this.props.imgstyle} source={this.props.source} />
      </TouchableOpacity>
    );
  }
}
