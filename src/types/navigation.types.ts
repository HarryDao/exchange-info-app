import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SymbolConfig } from './data-configs.types';
import { DataTypeEnum } from './enums';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Navigation
export type RootStackParamList = {
  MainStack: undefined;
  LoadingModal: undefined;
};

export type MainStackParamList = {
  ListTab: undefined;
  DetailScreen: {
    symbolConfig: SymbolConfig;
    dataType: DataTypeEnum;
  };
};

export type ListTabParamList = {
  StockScreen: undefined;
  ForexScreen: undefined;
  CryptoScreen: undefined;
};

// RootStack

export type MainStackNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MainStack'
>;

export type MainStackRouteProp = RouteProp<RootStackParamList, 'MainStack'>;

export interface MainStackNavProps {
  navigation: MainStackNavigationProp;
  route: MainStackRouteProp;
}

export type LoadingModalNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoadingModal'
>;

export type LoadingModalRouteProp = RouteProp<
  RootStackParamList,
  'LoadingModal'
>;

export interface LoadingModalNavProps {
  navigation: LoadingModalNavigationProp;
  route: LoadingModalRouteProp;
}

// Main Stack

export type ListTabNavigationProp = StackNavigationProp<
  MainStackParamList,
  'ListTab'
>;

export type ListTabRouteProp = RouteProp<MainStackParamList, 'ListTab'>;

export interface ListTabNavProps {
  navigation: ListTabNavigationProp;
  route: ListTabRouteProp;
}

export type DetailScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'DetailScreen'
>;

export type DetailScreenRouteProp = RouteProp<
  MainStackParamList,
  'DetailScreen'
>;

export interface DetailScreenNavProps {
  navigation: DetailScreenNavigationProp;
  route: DetailScreenRouteProp;
}

// List Tab

export type StockScreenNavigationProp = BottomTabNavigationProp<
  ListTabParamList,
  'StockScreen'
>;

export type StockScreenRouteProp = RouteProp<ListTabParamList, 'StockScreen'>;

export interface StockScreenNavProps {
  navigation: StockScreenNavigationProp;
  route: StockScreenRouteProp;
}

export type ForexScreenNavigationProp = BottomTabNavigationProp<
  ListTabParamList,
  'ForexScreen'
>;

export type ForexScreenRouteProp = RouteProp<ListTabParamList, 'ForexScreen'>;

export interface ForexScreenNavProps {
  navigation: ForexScreenNavigationProp;
  route: ForexScreenRouteProp;
}

export type CryptoScreenNavigationProp = BottomTabNavigationProp<
  ListTabParamList,
  'CryptoScreen'
>;

export type CryptoScreenRouteProp = RouteProp<ListTabParamList, 'CryptoScreen'>;

export interface CryptoScreenNavProps {
  navigation: CryptoScreenNavigationProp;
  route: CryptoScreenRouteProp;
}

export type ListTabNavigation = BottomTabNavigationProp<
  ListTabParamList,
  keyof ListTabParamList
>;
