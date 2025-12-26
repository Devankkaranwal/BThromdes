import { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Modal, FlatList, Image, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CloseIcon from '../assets/images/close.svg';
import { default as Text } from './GlobalText'


const PickerInput = ({
  label,
  selectedValue,
  onValueChange,
  errorText,
  items,
  placeholder,
  ...props
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    label: placeholder,
    image: null,
  });

  const { theme, hp, wp, RFValue } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    wrapper: {
      width: '100%',
      marginVertical: hp(1),
    },
    label: {
      fontSize: RFValue(12),
      color: theme.text,
      marginBottom: hp(1),
      marginHorizontal: wp(1),
    },
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: theme.primary,
      borderWidth: 1,
      borderRadius: wp(1),
      backgroundColor: theme.container,
      paddingHorizontal: wp(6),
      height: hp(7),
    },
    pickerText: {
      color: theme.text,
      fontSize: RFValue(12),
      marginLeft: wp(2),
    },
    selectedItemImage: {
      width: wp(5),
      height: wp(5),
      marginRight: wp(2),
    },
    modalBackground: {
      flex: 1,
      backgroundColor: theme.transparent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '85%',
      backgroundColor: theme.container,
      borderRadius: wp(1),
      padding: RFValue(20),
      paddingTop: hp(4),
      elevation: 5,
    },
    closeIconContainer: {
      position: 'absolute',
      top: hp(2),
      right: wp(3),
      zIndex: 1,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(2),
      borderBottomWidth: 1,
      borderBottomColor: theme.grayLight,
    },
    itemImage: {
      width: wp(8),
      height: wp(8),
      marginRight: wp(2),
    },
    itemText: {
      fontSize: RFValue(12),
      color: theme.text,
      flexShrink: 1,
    },
    listContainer: {
      paddingTop: hp(2),
    },
    errorText: {
      color: theme.error,
      fontSize: RFValue(10),
      marginTop: hp(1),
      marginHorizontal: wp(1),
    },
  }), [theme, hp, wp, RFValue]);

  const handleSelect = useCallback(
    (value, label, image) => {
      setSelectedItem({ label, image });
      onValueChange(value);
      setIsModalVisible(false);
    },
    [onValueChange]
  );

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        style={styles.pickerContainer}
        onPress={() => setIsModalVisible(true)}
      >
        {selectedItem.image && (
          <Image source={selectedItem.image} style={styles.selectedItemImage} />
        )}
        <Text style={styles.pickerText}>
          {selectedItem.label || placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
      >
        <Pressable
          style={styles.modalBackground}
          onPressOut={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.closeIconContainer}
              onPress={() => setIsModalVisible(false)}
            >
              <CloseIcon width={RFValue(15)} height={RFValue(15)} />
            </Pressable>

            <FlatList
              contentContainerStyle={styles.listContainer}
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.itemContainer}
                  onPress={() => handleSelect(item.value, item.label, item.image)}
                >
                  {item.image && (
                    <Image source={item.image} style={styles.itemImage} />
                  )}
                  <Text style={styles.itemText}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {errorText && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

export default PickerInput;
