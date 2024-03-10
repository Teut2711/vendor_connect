/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ActivityIndicator, Alert, BackHandler} from 'react-native';
import {VStack} from '@react-native-material/core';
import {Button, Text} from 'react-native-paper';
import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import {CLIENT_ID} from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/user.phonenumbers.read'],
  webClientId: CLIENT_ID,
  profileImageSize: 120,
});

interface GoogleAuthViewProps {
  navigation: {
    navigate: (screen: string, params: {userType: string}) => void;
  };
}

const GoogleAuthView: React.FC<GoogleAuthViewProps> = ({navigation}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const silentSignIn = async () => {
    try {
      setIsLoading(true);
      const {user: userInfo} = await GoogleSignin.signInSilently();
      console.log(userInfo);
      setUser(userInfo);
      setIsLoading(false);
    } catch (err) {
      if ((err as Record<string, any>).code === statusCodes.SIGN_IN_REQUIRED) {
        await loginSignin();
      } else {
        setErrors(e => [...e, (err as Record<string, any>).message]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginSignin = async () => {
    try {
      setIsLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();

      setUser(userInfo);
      setIsLoading(false);
    } catch (err) {
      if (
        (err as Record<string, string | number>).code ===
        statusCodes.SIGN_IN_CANCELLED
      ) {
        setErrors(e => [...e, 'Sign In cancelled']);
      } else if (
        (err as Record<string, string | number>).code ===
        statusCodes.IN_PROGRESS
      ) {
        setIsLoading(true);
      } else if (
        (err as Record<string, string | number>).code ===
        statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        setErrors(e => [...e, 'Play services not available']);
      } else {
        setErrors(e => [...e, (err as Record<string, any>).message]);
      } // some other error happened
    } finally {
      setIsLoading(false);
    }
  };
  const signInIfRequired = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await silentSignIn();
    } else {
      await loginSignin();
    }
  };

  const handleLogin = async (userType: string) => {
    await signInIfRequired();
    navigation.navigate('BACKEND/AUTH', {userType});
  };

  if (isLoading) {
    return <ActivityIndicator />;
  } else if (errors.length > 0) {
    return Alert.alert('Errors', [...errors].join('\n'), [
      {text: 'Close App', onPress: () => BackHandler.exitApp()},
    ]);
  }

  return (
    <VStack fill pt={5} style={{alignItems: 'center'}}>
      <Text style={{fontSize: 18, marginBottom: 20}}>Select Account Type:</Text>
      <VStack fill center spacing={50}>
        <Button
          mode="contained"
          onPress={() => handleLogin('vendor')}
          icon={({size, color}) => (
            <Icon name="google" size={size} color={color} />
          )}>
          Sign in as Vendor
        </Button>
        <Button
          mode="contained"
          onPress={() => handleLogin('customer')}
          icon={({size, color}) => (
            <Icon name="google" size={size} color={color} />
          )}
          style={{marginBottom: 10}}>
          Sign in as Customer
        </Button>
      </VStack>
    </VStack>
  );
};

export default GoogleAuthView;
