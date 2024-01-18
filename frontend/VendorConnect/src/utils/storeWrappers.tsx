import EncryptedStorage from 'react-native-encrypted-storage';

const StorageHelper = {
  // Get an item from storage
  getItem: async key => {
    try {
      const value = await EncryptedStorage.getItem(key);
      return value ? JSON.parse(value) : value;
    } catch (error) {
      console.error(`Error getting item from storage (${key}):`, error);
      return null;
    }
  },

  // Put an item into storage
  setItem: async (key, value) => {
    try {
      const serializedValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      await EncryptedStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item in storage (${key}):`, error);
    }
  },

  // Delete an item from storage
  removeItem: async key => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from storage (${key}):`, error);
    }
  },
};

export default StorageHelper;
