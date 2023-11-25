import { DataTypeEnum, DataProviderEnum } from './enums';

export interface SymbolConfig {
  symbol: string;
  displaySymbol?: string;
  description: string;
}

export interface SymbolConfigWithType extends SymbolConfig {
  type: DataTypeEnum;
}

export interface DataConfig {
  type: DataTypeEnum;
  provider: DataProviderEnum;
  symbols: SymbolConfig[];
}
