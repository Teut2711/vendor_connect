/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {createContext, useEffect, useState} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  useTheme,
  Text,
  Menu,
} from 'react-native-paper';
import ProductView from './screens/customer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VendorCard from './screens/vendor';
import {VStack} from '@react-native-material/core';
import GoogleAuthView from './screens/authentication/GoogleAuthView';
import BackendAuthView from './screens/authentication/BackendAuthView';
import VendorStartPagee from './screens/vendor/StartPage';
import ProductVendorPage from './screens/vendor/ProductVendorPage';
import EncryptedStorage from 'react-native-encrypted-storage';

const darkTheme = {...MD3DarkTheme};
const lightTheme = {...MD3LightTheme};

const Stack = createNativeStackNavigator();

const Section = (): JSX.Element => {
  const products = [
    {
      title: 'Morning English Breakfast',
      description: 'Fresh breakfast for early wakers',
    },
    {
      title: 'Healthy Salad',
      description: 'Nutritious salad for a light lunch',
    },
    {
      title: 'Classic Burger',
      description: 'Juicy burger with all the fixings',
    },
    {
      title: 'Vegetarian Pizza',
      description: 'Delicious pizza with assorted veggies',
    },
  ];

  return (
    <View style={styles.sectionContainer}>
      {products.map((product, index) => (
        <ProductView key={index} product={product} />
      ))}
    </View>
  );
};

const useTranslate = (
  message: string,
  sourceLanguage: string = 'en',
  targetLanguage: string = 'hi',
) => {
  const [value, setValue] = useState(message);

  useEffect(() => {
    const inner = async () => {
      try {
        // throw new Error('Raising for saving API');
        const url = `https://translate.google.com/m?tl=${targetLanguage}&sl=${sourceLanguage}&q=${encodeURIComponent(
          message,
        )}`;
        const res = await fetch(url);
        const htmlText = await res.text();

        // Use regex to extract the translated text
        const regex = /<div class="result-container">(.*?)<\/div>/s;
        const match = htmlText.match(regex);
        const translated = match ? match[1] : '';

        setValue(translated);
      } catch (err) {
        console.info(err);
      }
    };
    inner();
  });
  return value;
};

const Main = ({navigation}) => {
  const theme = useTheme();
  const title = 'How would you like to use this app?';
  return (
    <VStack fill center spacing={5} style={{justifyContent: 'space-evenly'}}>
      <Text>{title}</Text>
      <Button
        title="As a vendor to sell products and provide services"
        color={theme.colors.primary}
        onPress={() => navigation.navigate('APP_ROLE/VENDOR')}
      />
      <Button
        title="As a customer to buy products and avail services"
        color={theme.colors.secondary}
        onPress={() => navigation.navigate('CUSTOMER/HOME')}
      />
    </VStack>
  );
};
const VendorBusinessForm = ({navigation}) => {
  const theme = useTheme();

  return (
    <VStack fill center spacing={5} style={{justifyContent: 'space-evenly'}}>
      <Text>Please tell us something about your business!</Text>
      <Menu.Item
        leadingIcon="redo"
        onPress={() => {}}
        title="Ice cream vendor"
      />
      <Menu.Item
        leadingIcon="undo"
        onPress={() => {}}
        title="Vegetable seller"
      />
      <Menu.Item
        leadingIcon="content-cut"
        onPress={() => {}}
        title="Grocery"
        disabled
      />
      <Menu.Item
        leadingIcon="content-copy"
        onPress={() => {}}
        title="Auto Rickshaw"
        disabled
      />
    </VStack>
  );
};

export const GlobalContext = createContext(null);

const Screens = () => {
  const [mode, setMode] = useState('d');
  const [isGoogleAuthComplete, setIsGoogleAuthComplete] = useState(false);

  return (
    <GlobalContext.Provider
      value={{google: {isGoogleAuthComplete, setIsGoogleAuthComplete}}}>
      <PaperProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="LOGIN" component={GoogleAuthView} />
            <Stack.Screen name="BACKEND/AUTH" component={BackendAuthView} />
            <Stack.Screen name="VENDOR/START" component={VendorStartPagee} />
            <Stack.Screen
              name="VENDOR/PRODUCT/HOME"
              component={ProductVendorPage}
            />
            <Stack.Screen name="CUSTOMER/HOME" component={Section} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GlobalContext.Provider>
  );
};

function App(): JSX.Element {
  const link = createHttpLink({
    uri: 'http://localhost:8000/api/graphql/vendor', // URL of your GraphQL server
    credentials: 'include',
  });
  const authLink = setContext((_, {headers}) => {
    return EncryptedStorage.getItem('auth')
      .then(data => {
        const token = JSON.parse(data).token;
        return {
          headers: {
            ...headers,
            Authorization: `Token ${token}`,
          },
        };
      })
      .catch(err => {
        console.log('Could not get token', err);
      });
  });

  const client = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache(),
  });
  client.cache.reset({discardWatches: true});
  return (
    <ApolloProvider client={client}>
      <Screens />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
