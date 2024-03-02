import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {Modal, ScrollView, StyleSheet} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {VStack} from '@react-native-material/core';
import {CREATE_PRODUCT_MUTATION} from '../apis/mutations';
import {useMutation} from '@apollo/client';

const AddProductModal = ({modalVisible, handleModalVisible}) => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const {control, handleSubmit, reset} = useForm();
  const [createProduct, {loading, error}] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      onCompleted: () => {
        console.log('Vendor created successfully');
      },
      onError: error => {
        console.error('Error creating vendor', error);
      },
    },
  );

  const camera = useRef<Camera>(null);
  useEffect(() => {
    async function inner() {
      await requestPermission();
    }
    inner();
  }, []);
  const device = useCameraDevice('back');

  if (device == null) {
    return <Text>Error</Text>;
  }

  const onSubmit = async data => {
    const file = await (camera.current as Camera).takePhoto();
    const result = await fetch(`file://${file.path}`);
    const photo = await result.blob();
    console.log(data, photo); // Do something with the form data
    createProduct({
      variables: {
        name: data.productName,
        price: {value: Number(data.productPrice), currency: 'INR'},
        quantity: {value: Number(data.productQuantity), units: 'KG'},
        photo: photo,
        description: '',
      },
    });

    handleModalVisible(false); // Close the modal after submission
    reset(); // Reset form fields
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        handleModalVisible(false);
      }}>
      <VStack center>
        <Text variant="displayMedium" style={{marginHorizontal: 'auto'}}>
          Add product
        </Text>
      </VStack>
      <VStack center pt={60}>
        {hasPermission && (
          <Camera
            ref={camera}
            style={{height: 200, width: 200}}
            device={device}
            photo={true}
            isActive={true}
          />
        )}
      </VStack>
      <ScrollView style={{flexGrow: 0}}>
        <VStack spacing={4} h={'60%'} mr={7}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Product Name"
                value={value}
                onBlur={onBlur}
                onChangeText={text => onChange(text)}
              />
            )}
            name="productName"
            rules={{required: true}}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Product Price"
                value={value}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={text => onChange(text)}
              />
            )}
            name="productPrice"
            rules={{required: true}}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                mode="outlined"
                label="Product Quantity"
                keyboardType="numeric"
                value={value}
                onBlur={onBlur}
                onChangeText={text => onChange(text)}
              />
            )}
            name="productQuantity"
            rules={{required: true}}
            defaultValue=""
          />
          <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
        </VStack>
      </ScrollView>
    </Modal>
  );
};
export default AddProductModal;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
