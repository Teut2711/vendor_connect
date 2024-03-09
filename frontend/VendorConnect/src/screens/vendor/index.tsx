import {HStack, VStack} from '@react-native-material/core';
import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, Image, StyleSheet} from 'react-native';
import {ActivityIndicator, Button, Card, Chip, Text} from 'react-native-paper';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import BackendAuthView from '../authentication/BackendAuthView';
import {useQuery} from '@apollo/client';
import {GET_VENDOR_QUERY} from './apis/queries';
import {Avatar} from '@react-native-material/core';

const VendorCard = ({route, navigation}) => {
  const {data, loading, error} = useQuery(GET_VENDOR_QUERY);
  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return error.graphQLErrors.map(({message}, i) => (
      <Text variant="bodyLarge" style={{color: 'red'}} key={i}>
        {message}
      </Text>
    ));
  }

  if (!data || !data.vendor) {
    navigation.navigate('VENDOR/START');
    return null;
  }
  // if (data == null) {
  //   navigation.navigate('VENDOR/START');
  // }
  const {user, typeValue, mobility, profession} = data.vendor;
  return (
    <VStack fill spacing={4} p={5} m={2}>
      <VStack>
        <HStack spacing={4}>
          <Avatar image={{uri: user.photo.name}} />
          <VStack>
            <Text variant="displaySmall">{`${user.firstName} ${user.lastName}`}</Text>
            <Text variant="bodyLarge">{profession}</Text>
          </VStack>
        </HStack>
        <HStack>
          <Chip
            textStyle={{color: 'white'}}
            style={{backgroundColor: 'black', color: 'white'}}
            icon={() => <FontAwesome6 name={'lemon'} solid />}
            onPress={() => console.log('Pressed')}>
            Vegetable
          </Chip>
          <Chip
            textStyle={{color: 'white'}}
            style={{backgroundColor: 'black', color: 'white'}}
            icon={() => <FontAwesome6 name={'house'} solid />}
            onPress={() => console.log('Pressed')}>
            Home Delivery
          </Chip>
        </HStack>
      </VStack>
      <Button onPress={() => navigation.navigate('VENDOR/PRODUCT')}>
        Modify Product List
      </Button>
    </VStack>
  );
};

export default VendorCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    elevation: 4, // shadow depth
    borderRadius: 10,
  },
});
