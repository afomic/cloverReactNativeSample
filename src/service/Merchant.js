import Config from 'react-native-config';

export const sendCloverDetails = async (payload) => {
  const response = await fetch(Config.SERVER_URL + '/merchant/clover/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return response;
};