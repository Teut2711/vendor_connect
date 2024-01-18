import React, {useState} from 'react';
import {HStack} from '@react-native-material/core';
import {TextInput, TextInputProps, DataTable} from 'react-native-paper';
import {Modal, FlatList, TouchableOpacity} from 'react-native';

import countryInfoJson from '../components/countrycodes.json';
interface MobileFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}

const MobileField: React.FC<MobileFieldProps> = ({
  label,
  value,
  onChangeText,
  ...props
}) => {
  const {style, ...otherProps} = props;

  const [countryInfo, setCountryInfo] = useState({
    code: 'IN',
    ...countryInfoJson.IN,
  });
  const [mobileNumber, setMobileNumber] = useState('');

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <MyModal
        visible={visible}
        hideModal={hideModal}
        setCountryInfo={setCountryInfo}
      />
      <HStack fill center spacing={3}>
        <TouchableOpacity
          onPress={showModal}
          style={[
            {width: '40%', backgroundColor: 'rgba(0,0,0,0)', padding: 0},
          ]}>
          <TextInput
            style={[
              style,
              {width: '100%', backgroundColor: 'rgb(255,255,255)'},
            ]}
            left={<TextInput.Affix text={countryInfo.flag} />}
            inputMode="tel"
            mode="outlined"
            inlineImageLeft="phone"
            label="Country Code"
            value={countryInfo.dial_code}
            editable={false}
            autoComplete="tel-country-code"
          />
        </TouchableOpacity>
        <TextInput
          mode="outlined"
          inputMode="tel"
          keyboardType="decimal-pad"
          label={label}
          value={mobileNumber}
          onChangeText={val => {
            setMobileNumber(val);
            onChangeText(countryInfo.dial_code + val);
          }}
          style={[style, {flex: 1, width: '60%', backgroundColor: '#FFFFFF'}]}
          autoComplete="tel-national"
          {...otherProps}
        />
      </HStack>
    </>
  );
};

const MyModal = ({visible, hideModal, setCountryInfo}) => {
  const renderItem = ({item}) => {
    const code = item[0];
    const {name, flag, dial_code} = item[1];

    return (
      <DataTable.Row
        key={code}
        onPress={() => {
          setCountryInfo({code, flag, name, dial_code});
          hideModal();
        }}>
        <DataTable.Cell>{flag}</DataTable.Cell>
        <DataTable.Cell style={{width: '80%'}}>{name}</DataTable.Cell>
        <DataTable.Cell>{dial_code}</DataTable.Cell>
      </DataTable.Row>
    );
  };

  return (
    <Modal
      style={{margin: 7}}
      animationType="slide"
      visible={visible}
      onRequestClose={hideModal}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Flag</DataTable.Title>
          <DataTable.Title>Country name</DataTable.Title>
          <DataTable.Title>Code</DataTable.Title>
        </DataTable.Header>
        <FlatList
          data={Object.entries(countryInfoJson)}
          renderItem={renderItem}
          keyExtractor={item => item[0]}
        />
      </DataTable>
    </Modal>
  );
};
export default MobileField;
