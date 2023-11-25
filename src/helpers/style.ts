import { StyleProp } from 'react-native';

export const joinStyles = (...styles: any[]): StyleProp<any> => {
  return Object.assign({}, ...styles);
};
