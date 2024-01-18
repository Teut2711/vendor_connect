import {useEffect, useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CLIENT_ID} from '@env';

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/user.phonenumbers.read'],
  webClientId: CLIENT_ID,
  profileImageSize: 120,
});

const useGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const silentSignIn = async () => {
    try {
      setIsLoading(true);
      const {user: userInfo} = await GoogleSignin.signInSilently();
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
  useEffect(() => {
    const signInIfRequired = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await silentSignIn();
      } else {
        await loginSignin();
      }
    };

    signInIfRequired();
  }, []);

  return {user: user, isLoading: isLoading, errors: errors};
};

export default useGoogleAuth;
