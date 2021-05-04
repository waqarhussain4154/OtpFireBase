import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image } from 'react-native';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class PhoneAuthTest extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+92',
      confirmResult: null,
    };
  }

  componentDidMount() {
     this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+92',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });

    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }
  
  renderPhoneNumberInput() {
   const { phoneNumber } = this.state;
      
    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Phone number ... '}
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
      </View>
    );
  }
  
  renderMessage() {
    const { message } = this.state;
  
    if (!message.length) return null;
  
    return (
      <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
  }
  
  renderVerificationCodeInput() {
    const { codeInput } = this.state;
  
    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }

  render() {
    const { user, confirmResult } = this.state;
    return (
      <View style={{ flex: 1 }}>
        
        {!user && !confirmResult && this.renderPhoneNumberInput()}
        
        {this.renderMessage()}
        
        {!user && confirmResult && this.renderVerificationCodeInput()}
        
        {user && (
          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#77dd77',
              flex: 1,
            }}
          >
            <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
            <Text style={{ fontSize: 25 }}>Signed In!</Text>
            <Text>{JSON.stringify(user)}</Text>
            <Button title="Sign Out" color="red" onPress={this.signOut} />
          </View>
        )}
      </View>
    );
  }
}



// import React, { Component, Fragment } from "react";
// import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Image,} from 'react-native';
// import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
// import {
// GoogleSignin,
// GoogleSigninButton,
// statusCodes,
// } from 'react-native-google-signin';

// export default class LoginController extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       pushData: [],
//       loggedIn: false
//     }
//   }
//   componentDidMount() {
//     GoogleSignin.configure({
//       scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
//       webClientId: '1006554220175-rp0598ro1ktni34a4g276vhkavok6fcf.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//       offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//       hostedDomain: '', // specifies a hosted domain restriction
//       loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
//       forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//       accountName: '', // [Android] specifies an account name on the device that should be used
//       iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//     });
//   }
  

//   _signIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       alert(JSON.stringify(userInfo))
//       this.setState({ userInfo });
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//       } else {
//         // some other error happened
//         console.log(error)
//       }
//     }
//   };

//   getCurrentUserInfo = async () => {
//     try {
//       const userInfo = await GoogleSignin.signInSilently();
//       this.setState({ userInfo });
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_REQUIRED) {
//         // user has not signed in yet
//         this.setState({ loggedIn: false });
//       } else {
//         // some other error
//         this.setState({ loggedIn: false });
//       }
//     }
//   };

//   signOut = async () => {
//     try {
//       await GoogleSignin.revokeAccess();
//       await GoogleSignin.signOut();
//       this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   render() {
//     return (
//       <Fragment>
//         <StatusBar barStyle="dark-content" />
//         <SafeAreaView>
//           <ScrollView
//             contentInsetAdjustmentBehavior="automatic"
//             style={styles.scrollView}>
//             <Header />
//             {global.HermesInternal == null ? null : (
//               <View style={styles.engine}>
//                 <Text style={styles.footer}>Engine: Hermes</Text>
//               </View>
//             )}
//             <View style={styles.body}>
//               <View style={styles.sectionContainer}>
//                 <GoogleSigninButton
//                   style={{ width: 192, height: 48 }}
//                   size={GoogleSigninButton.Size.Wide}
//                   color={GoogleSigninButton.Color.Dark}
//                   onPress={this._signIn}
//                   disabled={this.state.isSigninInProgress} />
//               </View>
//               <View style={styles.buttonContainer}>
//                 <Button onPress={this.signOut}
//                   title="Signout"
//                   color="#841584">
//                 </Button> 
//               </View>

//               {!this.state.loggedIn && <LearnMoreLinks />}
//               {this.state.loggedIn && <View>
//                 <View style={styles.listHeader}>
//                   <Text>User Info</Text>
//                 </View>
//                 <View style={styles.dp}>
//                   <Image
//                     style={{ width: 100, height: 100 }}
//                     source={{ uri: this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.photo }}
//                   />
//                 </View>
//                 <View style={styles.detailContainer}>
//                   <Text style={styles.title}>Name</Text>
//                   <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.name}</Text>
//                 </View>
//                 <View style={styles.detailContainer}>
//                   <Text style={styles.title}>Email</Text>
//                   <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.email}</Text>
//                 </View>
//                 <View style={styles.detailContainer}>
//                   <Text style={styles.title}>ID</Text>
//                   <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.id}</Text>
//                 </View>
//               </View>}
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </Fragment>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   listHeader: {
//     backgroundColor: '#eee',
//     color: "#222",
//     height: 44,
//     padding: 12
//   },
//   detailContainer: {
//     paddingHorizontal: 20
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     paddingTop: 10
//   },
//   message: {
//     fontSize: 14,
//     paddingBottom: 15,
//     borderBottomColor: "#ccc",
//     borderBottomWidth: 1
//   },
//   dp:{
//     marginTop: 32,
//     paddingHorizontal: 24,
//     flexDirection: 'row',
//     justifyContent: 'center'
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//     flexDirection: 'row',
//     justifyContent: 'center'
//   },
//   buttonContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//     flexDirection: 'row',
//     justifyContent: 'center'
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// })


C:\Users\ZS\.android>keytool -exportcert -alias androiddebugkey -keystore 'C:\Users\ZS\Desktop\Waqar Projects\sms_services\android\app\debug.keystore' | xxd -p | tr -d "[:space:]" | echo -n com.sms_servicescat| sha256sum | tr -d "[:space:]-" | xxd -r -p | base64 | cut -c1-11
