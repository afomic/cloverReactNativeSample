import React, {Component} from "react";
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from "react-native";
import Clover from "react-native-clover"
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      token: "",
      deviceId:"",
      merchantId:""
    };
    this.getAuthToken = this.getAuthToken.bind(this);
    this.requestPermission = this.requestPermission.bind(this);
    this.sendCloverDetails=this.sendCloverDetails.bind(this);
  }

  componentDidMount() {
    this.getAuthToken()
  }

  render() {
    const {loading, token,deviceId,merchantId} = this.state;
    return <View style={styles.container}>
      <Text style={styles.tokenTitle}>Auth Token</Text>
      {loading && <ActivityIndicator style={styles.loadingIndicator}/>}
      {!loading &&<View>
        <Text style={styles.tokenText}>Token: {token}</Text>
        <Text style={styles.tokenText}> Device Id: {deviceId}</Text>
        <Text style={styles.tokenText}>Merchant Id: {merchantId}</Text>
      </View>}
      <TouchableOpacity style={styles.button} onPress={this.getAuthToken}>
        <Text style={{color: "white"}}>GET TOKEN</Text>

      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={this.sendCloverDetails}>
        <Text style={{color: "white"}}>Send Details</Text>

      </TouchableOpacity>

    </View>
  }
  async sendCloverDetails(){
    const {token,merchantId,deviceId}=this.state;
    const payload={
      authToken:token,
      merchantId,
      deviceId
    };
    const response= await sendCloverDetails(payload);
    console.log(response);
  }

  getAuthToken() {
    check(PERMISSIONS.ANDROID.GET_ACCOUNTS)
      .then(async result => {
        switch (result) {
          case RESULTS.DENIED:
            this.requestPermission();
            break;
          case RESULTS.GRANTED:


            try{
              const deviceResponse = await Clover.getDeviceId();
              this.setState({
                deviceId: deviceResponse.deviceId,
                loading: false
              })
            }catch (e){
              console.log(e)
            }
            try{
              const merchantResponse = await Clover.getMerchant();
              this.setState({
                merchantId: merchantResponse.Mid,
                loading: false
              })
            }catch (e){
              console.log(e)
            }
            try {
              this.setState({loading: true});
              const tokenResponse = await Clover.getAuthToken();

              this.setState({
                token: tokenResponse.token,
                loading: false
              })
            } catch (e) {
              console.log(e);
              this.setState({loading: false})
            }

            break;
        }
      })
      .catch(error => {
        // …
      });
  }


  requestPermission() {
    request(PERMISSIONS.ANDROID.GET_ACCOUNTS).then(result => {
      this.getAuthToken()
    });
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  tokenTitle: {},
  loadingIndicator: {
    margin: 8
  },
  tokenText: {
    margin: 8,
    fontWeight: "500"
  },
  button: {
    backgroundColor: "green",
    padding: 16,
    margin: 16
  }

});
export default HomeScreen