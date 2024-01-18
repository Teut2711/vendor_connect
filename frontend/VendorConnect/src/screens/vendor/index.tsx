import {HStack, VStack} from '@react-native-material/core';
import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, Image} from 'react-native';
import {ActivityIndicator, Avatar, Card, Chip, Text} from 'react-native-paper';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import BackendAuthView from '../authentication/BackendAuthView';
const user = {
  id: '',
  firstName: 'Rajiv',
  lastName: 'ABC',
  photo: '',
  type: 'VEGETABLE_SELLER',
  skills: ['HOME_DELIVERY', ''],
  shop: {
    id: '',
    name: 'Rajiv Store',
    location: {
      address: '567 Sector 9',
      coordinates: {
        latitude: '',
        longitude: '',
      },
    },
  },
};

const LeftContent = props => (
  <Avatar.Image
    size={24}
    source={require('../../assets/images/avatar_male.png')}
  />
);

const VendorCard = ({route}) => {
  return (
    <VStack>
      <Card>
        <Card.Title
          title={`${user.firstName} ${user.lastName}`}
          subtitle={`${user.shop.name}`}
          left={LeftContent}
        />
        {/* <Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
        </Card.Actions> */}
      </Card>
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
  );
};

export default VendorCard;
