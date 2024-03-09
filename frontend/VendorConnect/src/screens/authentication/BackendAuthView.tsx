import React, {ReactNode, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {Alert, BackHandler} from 'react-native';
import {BACKEND_BASE_URL, CLIENT_ID} from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

interface IBackendAuthViewProps {
  children: ReactNode;
  route: {
    params: {
      userType: string; // Assuming userType is a string, adjust the type accordingly
    };
  };
}

interface IGoogleAuthTokens {
  accessToken: string;
  idToken: string;
}

interface IAuthRequestBody {
  idToken: IGoogleAuthTokens['idToken'];
  userType: string;
  clientId: string;
}

interface IAuthResponse {
  token: string;
  expiry: string;
}

const checkIsTokenExpired = (
  auth: IAuthResponse,
): void | TokenExpiredError | Error => {
  const expiryTimestamp = Date.parse(auth.expiry);

  if (!isNaN(expiryTimestamp)) {
    const isTokenExpired = expiryTimestamp - Date.now() < 5 * 60 * 1000;
    if (isTokenExpired) {
      throw new TokenExpiredError('Backend api token expired');
    }
  } else {
    throw Error('Invalid timestamp format while checking token expiry');
  }
};

class TokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenExpired';
  }
}
class AuthTokenMissingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthTokenMissingError';
  }
}
class SignInError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SignInError';
  }
}
const BackendAuthView: React.FC<IBackendAuthViewProps> = ({
  route,
  navigation,
}): ReactNode => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {userType} = route.params;
  useEffect(() => {
    const performAuthWithBackend = async () => {
      try {
        const googleAuthTokens: IGoogleAuthTokens =
          await GoogleSignin.getTokens();
        setIsLoading(true);
        const url = `${BACKEND_BASE_URL}/api/auth/login/`;
        const body: IAuthRequestBody = {
          idToken: googleAuthTokens.idToken,
          clientId: CLIENT_ID,
          userType,
        };
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          const errorData = await response.json();
          setErrors(prevErrors => [...prevErrors, errorData.detail]);
        } else {
          const responseData = await response.json();
          await EncryptedStorage.setItem(
            'auth',
            JSON.stringify({
              token: responseData.token,
              expiry: responseData.expiry,
            }),
          );
        }
      } catch (err: any) {
        setErrors(prevErrors => [...prevErrors, err.message]);
      } finally {
        setIsLoading(false);
      }
    };
    const redirectToUserProfile = async () => {
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (!isSignedIn) {
          throw new SignInError('You are not signed in');
        }
        let auth = await EncryptedStorage.getItem('auth');
        if (!auth) {
          throw new AuthTokenMissingError('Auth Token is Missing');
        }

        auth = JSON.parse(auth as string);

        checkIsTokenExpired(auth as unknown as IAuthResponse);

        if (userType === 'vendor') {
          navigation.navigate('VENDOR/HOME');
        } else if (userType === 'customer') {
          navigation.navigate('CUSTOMER/HOME');
        } else {
          throw new Error(`Unknown user type: ${userType}`);
        }
      } catch (err) {
        if (
          err instanceof TokenExpiredError ||
          err instanceof AuthTokenMissingError
        ) {
          await performAuthWithBackend();
          await redirectToUserProfile();
        } else {
          setErrors(prevErrors => [
            ...prevErrors,
            'Error checking google sign in',
          ]);
        }
      }
      // finally {
      //   setIsLoading(false);
      // }
    };
    redirectToUserProfile();
  }, [userType, navigation]);

  if (isLoading === true) {
    return <ActivityIndicator />;
  } else if (errors.length > 0) {
    Alert.alert('Errors', [...errors].join('\n'), [
      {text: 'Close App', onPress: () => BackHandler.exitApp()},
    ]);
  }

  return <ActivityIndicator />;
};

export default BackendAuthView;
