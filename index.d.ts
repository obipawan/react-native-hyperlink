import { Component } from 'react';
import { StyleProp, TextStyle } from 'react-native';

interface Props {
  linkDefault: boolean;
  linkify: object;
  linkStyle?: StyleProp<TextStyle>;
  linkText: string | ((text: string) => string);
  onPress: (url: string, text: string) => void;
  onLongPress: (url: string, text: string) => void;
}

declare class HyperLink extends Component<Props> {}

export default HyperLink;
