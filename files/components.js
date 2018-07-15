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
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { loc } from "./locales.js";
const styles = StyleSheet.create(appStyle);

export class CustomModal extends Component {
  render() {
    let arr = this.props.objects.map((item, index) => (
      <TouchableOpacity
        style={{ margin: 5 }}
        key={index}
        onPress={() => item.func()}
      >
        <Text style={{ fontSize: 20 }}>{"• " + item.text}</Text>
      </TouchableOpacity>
    ));

    return !this.props.on ? null : (
      <View style={styles.modalmain}>
        <TouchableOpacity onPress={this.props.dim} style={styles.touch} />
        <View style={styles.dim} />

        <View style={styles.modal}>{arr}</View>
      </View>
    );
  }
}

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
              flex: 8
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
              flex: 6
            }}
          >
            <Text style={{ fontSize: 14, alignSelf: "flex-end" }}>
              {this.props.latest}
            </Text>
            {colorized()}
          </View>
          <View
            style={{
              flex: 4
            }}
          >
            <Text style={{ fontSize: 14, alignSelf: "flex-end" }}>
              {this.props.base_volume}
            </Text>
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
    this.props.fu;
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
                style={{ width: 27, height: 27 }}
                source={require("./img/menu.png")}
              />
            </TouchableHighlight>
          }
        >
          <MenuItem
            onPress={() => {
              this.props.langmenu();
              this._menu.hide();
            }}
          >
            {this.props.langtext}
          </MenuItem>
          <MenuDivider />
          <MenuItem onPress={this.hideMenu}>{this.props.donateUs}</MenuItem>
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

export class SortBar extends Component {
  render() {
    let lang = this.props.lang;

    let funct = this.props.func;
    let hoverbut = this.props.hoverbut;
    let buttons = [
      loc[lang].sortName,
      loc[lang].sortPrice,
      loc[lang].sortChange,
      loc[lang].sortVolume
    ];
    let buttMap = buttons.map((item, index) => {
      let txtstyle = {
        alignSelf: "center",
        color: "white",
        fontSize: this.props.fontsize
      };
      let style = {};
      if (index == hoverbut || index == hoverbut - 100)
        txtstyle.color = "yellow";
      if (index == 0) {
        txtstyle.alignSelf = "flex-start";
        style.marginStart = 5;
        style.flex = 8;
        // style.borderStyle = 'solid';
        // style.borderTopWidth = 1;
      }
      if (index == 1) {
        txtstyle.alignSelf = "flex-end";
        style.flex = 3;
        // style.borderStyle = 'solid';
        // style.borderTopWidth = 2;
        // style.borderTopColor = 'blue';
      }
      if (index == 2) {
        txtstyle.alignSelf = "flex-end";
        style.flex = 3;
        // style.borderStyle = 'solid';
        // style.borderTopWidth = 2;
        // style.borderTopColor = 'yellow';
      }
      if (index == 3) {
        txtstyle.alignSelf = "flex-end";
        style.flex = 4;
        style.marginEnd = 5;
        // style.borderStyle = 'solid';
        // style.borderTopWidth = 2;
        // style.borderTopColor = 'red';
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
          style={style}
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
        onPress={id == undefined ? this.props.func : this.props.func(id)}
      >
        <Image style={this.props.imgstyle} source={this.props.source} />
      </TouchableOpacity>
    );
  }
}
