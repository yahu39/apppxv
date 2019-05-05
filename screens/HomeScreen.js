import React, { Component } from "react";
import { Header, Input, Button, Icon, Text, Overlay } from "react-native-elements";
import {   View, StyleSheet, SafeAreaView, Image, Picker, 
  Alert, DatePickerAndroid, ActivityIndicator, TouchableWithoutFeedback
} from "react-native";
import { BarCodeScanner, Permissions } from "expo";
import firebase, { fireStoreDataBase } from "./Firebase";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    console.ignoredYellowBox = ['Setting a timer'];
  }
  static navigationOptions = {
    header: null
  };

  state = {
    isVisible: false,
    hasCameraPermission: null,
    TextCodBarras: "Escanear Código",
    TextName: "Detalle Producto",
    InputCantidad: 0,
    InputEan: 0,
    InputUbicacion: "",
    spinnerText: null,
    spinnerDate: null,
    isCorrect: false,
    isCargando: false,
    PlazoRetiro: 0
  };

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _handleBarCodeRead = data => {
    this.setState({
      isVisible: false,
      TextCodBarras: data.data,
      isCargando: true
    });
    console.log(data.data);
    fireStoreDataBase
      .collection("Productos")
      .doc(data.data)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          this.setState({
            //
            TextName: doc.data().PRODUCTO,
            PlazoRetiro: doc.data().PLAZORETIRO,
            isCorrect: true,
            isCargando: false
          });
        } else {
          console.log("No such document!");
          this.setState({
            TextName: "PRODUCTO NO REGISTRADO",
            isCorrect: false,
            isCargando: false
          });
        }
      })
      .catch(error => {
        console.log("Error getting document:", error);
        this.setState({
          TextName: "ERROR AL BUSCAR",
          isCorrect: false,
          isCargando: false
        });
      });
  };

  Barcode() {
    this.setState({ isVisible: true });
    this._requestCameraPermission();
  }

  showPicker = async (stateKey, options) => {
    console.log(options);
    try {
      var newState = {};
      const { action, year, month, day } = await DatePickerAndroid.open(
        options
      );
      if (action === DatePickerAndroid.dismissedAction){
        newState[stateKey + "Text"] = "dismissed";
      } else {
        var date = new Date( year, month, day);
        newState[stateKey + "Text"] = date.toLocaleDateString();
        newState[stateKey + "Date"] = date;
      }
      this.setState(newState);
    } catch({ code, message }){
        console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Overlay
          isVisible={this.state.isVisible}
          overlayBackgroundColor="rgba(0, 0, 0, .4)"
          width="100%"
          height="100%"
          onBackdropPress={() =>
            this.setState(
              { isVisible: false }
            )
          }
          overlayStyle={
            { flex: 1, alignItems: "center", justifyContent: "center" }
          }
        >
          {this.state.hasCameraPermission === null ? (
            <Text>Requesting for camera permission</Text>
          ) : this.state.hasCameraPermission === false ? (
            <Text>Camera permission is not granted</Text>
          ) : (
                <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead.bind(this)}
                  style={{ height: "100%", width: "100%" }}
                >
                </BarCodeScanner>
              )}
        </Overlay>
        <Header
          statusBarProps={{
            backgroundColor: "#ffffff",
            barStyle: "dark-content"
          }}
          barStyle="dark-content"
          centerComponent={
            <Image
              resizeMode="contain"
              style={{ width: 150 }}
              source={require("../assets/images/0.png")}
            />
          }
          containerStyle={{
            backgroundColor: "#ffffff",
            justifyContent: "space-around"
          }}>
        </Header>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderTopColor: "#E2E03E",
            borderTopWidth: 3,
            elevation: 0.5
          }}
        >
          {/* icono y texto de  ESCANEAR CODIGO */}
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => this.Barcode()}>
              <Icon
                reverse
                name="ios-qr-scanner"
                type="ionicon"
                color="#5fa62c"
              />
            </TouchableWithoutFeedback>
            <View>
              <Text h4 style={{ fontWeight: "normal" }}>
                {this.state.TextCodBarras}
              </Text>
              {/*                 <Input
                    placeholder={this.state.TextCodBarras}
                    onEndEditing= { data =>
                      this.setState(
                        { TextCodBarras : this._handleBarCodeRead(data.data) }
                      )}
                    keyboardType="numeric"
                    inputContainerStyle={{
                      height: 400,
                      borderBottomColor: "rgba(220,220,220,.6)"
                    }}
                    errorStyle={{ color: "red" }}
                >
                </Input> */}
            </View>
          </View>
          {/* FIN icono y texto de  ESCANEAR CODIGO */}
          {(this.state.isCargando && <View style={styles.container} />) ||
            (<View style={[styles.container, { paddingHorizontal: 10 }]}>
              <Text h4 style={{ textAlign: "center" }}>
                {this.state.TextName}
              </Text>
            </View>
            )}

          {this.state.isCargando ? (
            <View style={styles.container} />
          ) : (
              <View style={styles.container}>
                <View style={{ flex: 2, alignItems: "center" }}>
                  {this.state.isCorrect ? (
                    <Icon
                      reverse
                      name="md-pricetags"
                      type="ionicon"
                      color="#5FA62C"
                    >
                    </Icon>
                  ) : (
                      <Icon
                        reverse
                        name="md-pricetags"
                        type="ionicon"
                        color="#c6c6c6"
                      >
                      </Icon>
                    )}
                </View>
                <View style={{ flex: 5, paddingRight: 5 }}>
                  {this.state.isCorrect ? (
                    <Input
                      onChangeText={cantidad =>
                        this.setState(
                          { InputCantidad: parseInt(cantidad) }
                        )
                      }
                      placeholder="Cantidad"
                      keyboardType="numeric"
                      inputContainerStyle={{
                        height: 800,
                        borderBottomColor: "rgba(220,220,220,.6)"
                      }}
                      errorStyle={{ color: "red" }}
                    >
                    </Input>
                  ) : (
                      <Input
                        editable={false}
                        placeholder="Cantidad"
                        inputContainerStyle={{ height: 800 }}
                      >
                      </Input>
                    )}
                </View>
              </View>
            )}
          {this.state.isCargando ? (
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#5FA62C" />
            </View>
          ) : (
              <View style={styles.container}>
                <View style={{ flex: 2, alignItems: "center" }}>
                  {this.state.isCorrect ? (
                    <Icon
                      reverse
                      name="md-pricetags"
                      type="ionicon"
                      color="#5FA62C"
                    >
                    </Icon>
                  ) : (
                      <Icon
                        reverse
                        name="md-pricetags"
                        type="ionicon"
                        color="#c6c6c6"
                      >
                      </Icon>
                    )}
                </View>
                <View style={{ flex: 5, paddingRight: 5 }}>
                  {this.state.isCorrect ? (
                    <Picker
                      prompt="Seleccionar"
                      selectedValue={this.state.InputUbicacion}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ InputUbicacion: itemValue })
                      }
                    >
                      <Picker.Item label="A1" value="A1" />
                      <Picker.Item label="A2" value="A2" />
                      <Picker.Item label="A3" value="A3" />
                      <Picker.Item label="A4" value="A4" />
                      <Picker.Item label="A5" value="A5" />
                      <Picker.Item label="A6" value="A6" />
                      <Picker.Item label="B1" value="B1" />
                      <Picker.Item label="B2" value="B2" />
                      <Picker.Item label="B3" value="B3" />
                      <Picker.Item label="B4" value="B4" />
                      <Picker.Item label="B5" value="B5" />
                      <Picker.Item label="B6" value="B6" />
                      <Picker.Item label="B7" value="B7" />
                      <Picker.Item label="B8" value="B8" />
                      <Picker.Item label="B9" value="B9" />
                      <Picker.Item label="B10" value="B10" />
                      <Picker.Item label="B11" value="B11" />
                      <Picker.Item label="C1" value="C1" />
                      <Picker.Item label="C2" value="C2" />
                      <Picker.Item label="C3" value="C3" />
                      <Picker.Item label="C4" value="C4" />
                      <Picker.Item label="C5" value="C5" />
                      <Picker.Item label="C6" value="C6" />
                      <Picker.Item label="C7" value="C7" />
                      <Picker.Item label="C8" value="C8" />
                      <Picker.Item label="C9" value="C9" />
                      <Picker.Item label="C10" value="C10" />
                      <Picker.Item label="C11" value="C11" />
                      <Picker.Item label="C12" value="C12" />
                      <Picker.Item label="C13" value="C13" />
                      <Picker.Item label="C14" value="C14" />
                      <Picker.Item label="C15" value="C15" />
                      <Picker.Item label="C16" value="C16" />
                      <Picker.Item label="C17" value="C17" />
                      <Picker.Item label="C18" value="C18" />
                      <Picker.Item label="C19" value="C19" />
                      <Picker.Item label="C20" value="C20" />
                      <Picker.Item label="C21" value="C21" />
                      <Picker.Item label="C22" value="C22" />
                      <Picker.Item label="D1" value="D1" />
                      <Picker.Item label="D2" value="D2" />
                      <Picker.Item label="D3" value="D3" />
                      <Picker.Item label="D4" value="D4" />
                      <Picker.Item label="D5" value="D5" />
                      <Picker.Item label="D6" value="D6" />
                      <Picker.Item label="D7" value="D7" />
                      <Picker.Item label="D8" value="D8" />
                      <Picker.Item label="D9" value="D9" />
                      <Picker.Item label="D10" value="D10" />
                      <Picker.Item label="D11" value="D11" />
                      <Picker.Item label="D12" value="D12" />
                      <Picker.Item label="D13" value="D13" />
                      <Picker.Item label="D14" value="D14" />
                      <Picker.Item label="D15" value="D15" />
                      <Picker.Item label="D16" value="D16" />
                      <Picker.Item label="D17" value="D17" />
                      <Picker.Item label="D18" value="D18" />
                      <Picker.Item label="D19" value="D19" />
                      <Picker.Item label="D20" value="D20" />
                      <Picker.Item label="D21" value="D21" />
                      <Picker.Item label="D22" value="D22" />
                      <Picker.Item label="E1" value="E1" />
                      <Picker.Item label="E2" value="E2" />
                      <Picker.Item label="E3" value="E3" />
                      <Picker.Item label="E4" value="E4" />
                      <Picker.Item label="E5" value="E5" />
                      <Picker.Item label="E6" value="E6" />
                      <Picker.Item label="E7" value="E7" />
                      <Picker.Item label="E8" value="E8" />
                      <Picker.Item label="E9" value="E9" />
                      <Picker.Item label="E10" value="E10" />
                      <Picker.Item label="E11" value="E11" />
                      <Picker.Item label="E12" value="E12" />
                      <Picker.Item label="E13" value="E13" />
                      <Picker.Item label="E14" value="E14" />
                      <Picker.Item label="E15" value="E15" />
                      <Picker.Item label="E16" value="E16" />
                      <Picker.Item label="E17" value="E17" />
                      <Picker.Item label="E18" value="E18" />
                      <Picker.Item label="E19" value="E19" />
                      <Picker.Item label="E20" value="E20" />
                      <Picker.Item label="E21" value="E21" />
                      <Picker.Item label="E22" value="E22" />
                      <Picker.Item label="F1" value="F1" />
                      <Picker.Item label="F2" value="F2" />
                      <Picker.Item label="F3" value="F3" />
                      <Picker.Item label="F4" value="F4" />
                      <Picker.Item label="F5" value="F5" />
                      <Picker.Item label="F6" value="F6" />
                      <Picker.Item label="F7" value="F7" />
                      <Picker.Item label="F8" value="F8" />
                      <Picker.Item label="F9" value="F9" />
                      <Picker.Item label="F10" value="F10" />
                      <Picker.Item label="F11" value="F11" />
                      <Picker.Item label="F12" value="F12" />
                      <Picker.Item label="F13" value="F13" />
                      <Picker.Item label="F14" value="F14" />
                      <Picker.Item label="F15" value="F15" />
                      <Picker.Item label="F16" value="F16" />
                      <Picker.Item label="F17" value="F17" />
                      <Picker.Item label="F18" value="F18" />
                      <Picker.Item label="F19" value="F19" />
                      <Picker.Item label="F20" value="F20" />
                      <Picker.Item label="F21" value="F21" />
                      <Picker.Item label="F22" value="F22" />
                      <Picker.Item label="G1" value="G1" />
                      <Picker.Item label="G2" value="G2" />
                      <Picker.Item label="G3" value="G3" />
                      <Picker.Item label="G4" value="G4" />
                      <Picker.Item label="G5" value="G5" />
                      <Picker.Item label="G6" value="G6" />
                      <Picker.Item label="G7" value="G7" />
                      <Picker.Item label="G8" value="G8" />
                      <Picker.Item label="G9" value="G9" />
                      <Picker.Item label="G10" value="G10" />
                      <Picker.Item label="G11" value="G11" />

                    </Picker>
                  ) : (
                      <Input
                        editable={false}
                        placeholder="Cantidad"
                        inputContainerStyle={{ height: 800 }}
                      >
                      </Input>
                    )}
                </View>
              </View>             
              )
          }
          {(this.state.isCargando && <View style= { styles.container } /> ) ||
            ((this.state.isCorrect && (
              <TouchableWithoutFeedback
                onPress = { this.showPicker.bind(this, "spinner", {
                  date: this.state.presetDate
                })}
              >
              <View style = { styles.container}>
                <View style = {{ flex: 2, alignItems: "center"}}>
                  <Icon 
                    reverse
                    name = "md-calendar"
                    type = "ionicon"
                    color = "#5FA62C"
                  />
                </View>
                <View style = {{ flex: 5, paddingRight: 5}}>
                  <View>
                    <Input
                      label = "Fecha"
                      placeholder = "Seleccione una fecha"
                      value = {this.state.spinnerText}
                      inputContainerStyle = {{
                        height: 800,
                        borderBottomColor: "rgba(220, 220, 220, .6"
                      }}
                      errorStyle = {{ color: "red"}}
                      errorMessage = "Ingrese una fecha Válida"
                      editable = {false}
                    />
                  </View>
                </View>
              </View>
              </TouchableWithoutFeedback>  
            )) || (
              <View style = {styles.container}>
                <View style = { {flex: 2, alignItems: "center" }}>
                  <Icon
                    reverse
                    name = "md-calendar"
                    type = "ionicon"
                    color = "#c6c6c6"
                  />
                </View>
                <View style = {{flex: 5, paddingRight: 5 }}>
                  <View>
                    <Input
                      placeholder = "Seleccione una fecha"
                      inputContainerStyle = { { height: 800 }}
                      editable = { false}
                    />
                  </View>
                </View>
              </View>
          ))}

          <View style={styles.container}>
            {this.state.isCorrect ? (
              <Button
                title="Guardar"
                onPress={() => this.GuardarData()}
                icon={
                  <Icon
                    name="md-cloud-upload"
                    type="ionicon"
                    size={
                      30 //titleStyle={{ fontWeight: "bold" }}
                    }
                    color="white"
                  />
                }
                buttonStyle={
                  {
                    backgroundColor: "rgba(95, 162,44, 1)",
                    width: 300,
                    height: 45,
                    borderRadius: 50
                  } //borderWidth: 0, //borderColor: "transparent",
                }
              />
            ) : (
                <Button
                  title="Guardar"
                  disabled={true}
                  icon={
                    <Icon
                      name="md-cloud-upload"
                      type="ionicon"
                      size={
                        30 //titleStyle={{ fontWeight: "bold" }}
                      }
                      color="white"
                    />
                  }
                  buttonStyle={
                    {
                      backgroundColor: "rgba(198, 198,198, 1)",
                      width: 300,
                      height: 45,
                      borderRadius: 50
                    } //borderWidth: 0, //borderColor: "transparent",
                  }
                />
              )}
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white"
  }
});