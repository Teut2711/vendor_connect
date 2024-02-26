import React from 'react';
import {HStack, VStack} from '@react-native-material/core';
import {Avatar, Button, Text} from 'react-native-paper';

const ProductVendorPage = () => {
  return (
    <VStack>
      <HStack>
        <Avatar.Image
          size={24}
          source={require('src/assets/images/avatar_male.png')}
        />
        <Text>Vishesh Mangla</Text>
      </HStack>
      <VStack>
        <Text>Customer A</Text>
        <Button
          icon="map-marker-outline"
          mode="contained"
          onPress={() => console.log('Pressed')}>
          Press me
        </Button>
      </VStack>
    </VStack>
  );
};

export default ProductVendorPage;
