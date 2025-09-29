import axios from 'axios';

const testAPI = async () => {
  try {
    const response = await axios.get('https://quiversoftware.net/api/menu/with-settings', {
      headers: {
        'x-user-id': 'user99999'
      }
    });
    console.log('API Response:', response.data);
    console.log('Menu items:', response.data.menu?.length || 0);
  } catch (error) {
    console.error('API Error:', error);
  }
};

testAPI();