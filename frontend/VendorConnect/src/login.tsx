import React, {useState, useEffect, useRef, forwardRef} from 'react';
import firebaseAuth from '@react-native-firebase/auth';
import {
  Button,
  Text,
  TextInput,
  ActivityIndicator,
  MD2Colors,
} from 'react-native-paper';
import {VStack} from '@react-native-material/core';

type IUser = null | Record<string, any>;

const LoginForm = forwardRef((props, ref) => {
  const [user, setUser] = useState<IUser>();
  function getMap() {
    if (!ref.current) {
      ref.current = new Map();
    }
    return ref.current;
  }

  return (
    <VStack>
      <TextInput
        ref={node => {
          const map = getMap();
          if (node) {
            map.set('email', node);
          } else {
            map.delete('email');
          }
        }}
        label={'Email'}
        onChangeText={value => setUser(u => ({...u, email: value}))}
      />
      <TextInput
        ref={node => {
          const map = getMap();
          if (node) {
            map.set('password', node);
          } else {
            map.delete('password');
          }
        }}
        label={'Password'}
        secureTextEntry
        onChangeText={value => setUser(u => ({...u, password: value}))}
      />
      <Button mode="contained" onPress={props.handleFormSubmit}>
        Login
      </Button>
    </VStack>
  );
});

function Login() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<null | Record<string, any>>(null);

  const formRef = useRef<null | Map<String, any>>(null);
  function getMap() {
    if (!formRef.current) {
      // Initialize the Map on first usage.
      formRef.current = new Map();
    }
    return formRef.current;
  }

  function handleFormSubmit() {
    const map = getMap();
    setUser({
      email: map.get('email').value,
      password: map.get('password').value,
    });
  }
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = firebaseAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing === true) {
    return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
  }

  if (!user) {
    return <LoginForm handleFormSubmit={handleFormSubmit} ref={formRef} />;
  }

  return <Text>Welcome {user.email}</Text>;
}
export default Login;
