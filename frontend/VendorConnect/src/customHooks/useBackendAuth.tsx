import {useEffect, useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {BACKEND_BASE_URL, CLIENT_ID} from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
const useBackendAuth = () => {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const performAuthWithBackend = async googleAuthTokens => {
    try {
      setIsLoading(true);
      const url = `${BACKEND_BASE_URL}/api/auth/login/`;
      console.log(url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: googleAuthTokens.idToken,
          clientId: CLIENT_ID,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(prevErrors => [...prevErrors, errorData.detail]);
      } else {
        const responseData = await response.json();
        EncryptedStorage.setItem('token', responseData.token);
      }
    } catch (err) {
      setErrors(prevErrors => [...prevErrors, err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkIsSignedIn = async () => {
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          const googleAuthTokens = await GoogleSignin.getTokens();
          await performAuthWithBackend(googleAuthTokens);
        }
      } catch (err) {
        setErrors(prevErrors => [...prevErrors, 'Error checking isSignedIn']);
      } finally {
        setIsLoading(false);
      }
    };

    checkIsSignedIn();
  }, []);

  return {isLoading, errors};
};

export default useBackendAuth;
