import React, {useState} from 'react';

import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {Dropdown} from 'react-native-element-dropdown';
import {VStack} from '@react-native-material/core';
import {Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import DropdownComponent from '../../common/components/DropdownComponent';

const VendorStartPage = () => {
  const [businessType, setBusinessType] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const dataProduct = [
    {label: 'Grocery', value: 'grocery'},
    {label: 'Ice cream', value: 'ice-cream'},
  ];
  const dataService = [
    {label: 'House Maid', value: 'house-maid'},
    {label: 'Auto Ricksaw', value: 'auto-ricksaw'},
  ];

  return (
    <VStack fill>
      <ProgressSteps>
        <ProgressStep label="Select business type">
          <DropdownComponent
            data={[
              {label: 'Service', value: 'service'},
              {label: 'Product', value: 'product'},
            ]}
            label="What is your business type?"
            value={businessType}
            setValue={setBusinessType}
          />
        </ProgressStep>
        <ProgressStep label={`Select your ${businessType}`}>
          <VStack>
            {businessType === 'service' && (
              <DropdownComponent
                data={dataService}
                label="Select your service"
                value={selectedService}
                setValue={setSelectedService}
              />
            )}
            {businessType === 'Product' && (
              <DropdownComponent
                label="Select your product"
                value={selectedProduct}
                data={dataProduct}
                setValue={setSelectedProduct}
              />
            )}
          </VStack>
        </ProgressStep>
      </ProgressSteps>
    </VStack>
  );
};
const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default VendorStartPage;
