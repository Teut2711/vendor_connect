import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {VStack} from '@react-native-material/core';
import {Button, Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useForm, Controller} from 'react-hook-form';
import {useMutation} from '@apollo/client';
import {CREATE_VENDOR_MUTATION} from './apis/mutations';

const DropdownField = ({lang, data, value, onChange, onBlur}) => {
  return (
    <Dropdown
      style={[styles.dropdown]}
      containerStyle={[styles.container]}
      placeholderStyle={[styles.placeholderStyle]}
      selectedTextStyle={[styles.selectedTextStyle]}
      itemTextStyle={[styles.itemTextStyle]}
      data={data}
      labelField={`label.${lang}`}
      value={value}
      maxHeight={300}
      valueField="value"
      onBlur={onBlur}
      // onFocus={() => setIsFocus(true)}
      onChange={onChange}
    />
  );
};

const VendorStartPage = ({navigation}) => {
  const [language, setLanguage] = useState('hindi');
  const [createVendor, {loading, error}] = useMutation(CREATE_VENDOR_MUTATION, {
    onCompleted: () => {
      console.log('Vendor created successfully');
    },
    onError: error => {
      console.error('Error creating vendor', error);
    },
  });
  const vendorTypes = [
    {
      label: {
        english: 'Product',
        hindi: 'सामान बेचने वाले',
      },
      value: 'PRODUCT',
    },
    // {label: 'Service', value: 'service'},
  ];
  const mobility = [
    {
      label: {
        english: 'Moving Vendor',
        hindi: 'चलता फिरता विक्रेता',
      },
      value: 'MOBILE',
    },
    {
      label: {
        english: 'Stationary Vendor',
        hindi: 'स्थिर दुकानवाले विक्रेता',
      },
      value: 'STATIONARY',
    },
  ];
  const profession = [
    {
      label: {
        english: 'Ice Cream Seller',
        hindi: 'आइस क्रीम बेचने वाले',
      },
      value: 'ICE_CREAM',
    },
    {
      label: {
        english: 'Juice Seller',
        hindi: 'जूस बेचने वाले',
      },
      value: 'JUICE',
    },
    {
      label: {
        english: 'Vegetable Seller',
        hindi: 'सब्जी बेचने वाले',
      },
      value: 'VEGETABLE',
    },
    {
      label: {
        english: 'Fruit Seller',
        hindi: 'फल बेचने वाले',
      },
      value: 'FRUIT',
    },
  ];

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm();
  const onSubmit = data => {
    createVendor({
      variables: {
        typeValue: 'PRODUCT',
        mobility: data.mobility,
        profession: data.profession,
      },
    });

    navigation.navigate('VENDOR/HOME');
  };

  const onError = (errors, e) => {
    return console.log(errors);
  };
  return (
    <VStack fill p={7} spacing={20}>
      {/* <VStack>
        <Text>Select vendor type</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <DropdownField
              lang={language}
              data={vendorTypes}
              onBlur={onBlur}
              onChange={({value}) => onChange(value)}
              value={value}
            />
          )}
          name="vendorType"
          rules={{required: true}}
        />
      </VStack> */}
      <VStack>
        <Text>Mobility</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <DropdownField
              lang={language}
              data={mobility}
              onBlur={onBlur}
              onChange={({value}) => onChange(value)}
              value={value}
            />
          )}
          name="mobility"
          rules={{required: true}}
        />
      </VStack>
      <VStack>
        <Text>Profession</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <DropdownField
              lang={language}
              data={profession}
              onBlur={onBlur}
              onChange={({value}) => onChange(value)}
              value={value}
            />
          )}
          name="profession"
          rules={{required: true}}
        />
      </VStack>
      <VStack>
        <Button
          style={{marginTop: 20}}
          mode="contained"
          icon={({size, color}) => (
            <Icon name="user" size={size} color={color} />
          )}
          buttonColor="#56b9ff"
          onPress={handleSubmit(onSubmit)}
          loading={loading}>
          Create Profile
        </Button>
      </VStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'black',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'black',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'blue',
  },
  selectedTextStyle: {
    fontSize: 19,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    color: '#000000',
  },
});
export default VendorStartPage;
