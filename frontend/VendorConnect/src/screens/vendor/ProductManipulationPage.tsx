import React, {useEffect, useState} from 'react';
import {HStack, VStack} from '@react-native-material/core';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import {GET_VENDOR_QUERY} from './apis/queries'; // Make sure the path is correct
import {useQuery} from '@apollo/client';
import {Card} from 'react-native-paper';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Image, StyleSheet} from 'react-native';
import AddProductModal from './components';

const ProductCard = () => {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  return (
    <HStack style={{justifyContent: 'space-around'}}>
      <Image
        source={{
          uri: 'https://t4.ftcdn.net/jpg/02/56/59/09/240_F_256590939_sOJseFyxZjw268kbjsGIRSWiJdJTGJkz.jpg',
        }}
        width={50}
        height={50}
      />
      <VStack spacing={4}>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Product Name"
              value={value}
              onBlur={onBlur}
            />
          )}
          name="productName"
          rules={{required: true}}
        />
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Product Price"
              value={value}
              onBlur={onBlur}
            />
          )}
          name="productPrice"
          rules={{required: true}}
        />
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Product Quantity"
              value={value}
              onBlur={onBlur}
            />
          )}
          name="productQuantity"
          rules={{required: true}}
        />
      </VStack>
    </HStack>
  );
};

const ProductManipulationPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <VStack>
      <VStack>
        <AddProductModal
          modalVisible={modalVisible}
          handleModalVisible={(p: boolean) => setModalVisible(p)}
        />
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Add new Product
        </Button>
        <ProductCard />
      </VStack>
    </VStack>
  );
};

export default ProductManipulationPage;
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
