import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { dataConfigsSelectors } from 'src/redux/dataConfigs';
import { shortHistoricalActions } from 'src/redux/shortHistorical';
import { AppDispatch } from 'src/redux/store';
import { DataTypeEnum, SymbolConfig } from 'src/types';
import { BriefInfo } from './BriefInfo';
import { SearchBar } from './SearchBar';
import { makeStyles } from '@rneui/base';

const isMatched = (
  { symbol, displaySymbol, description }: SymbolConfig,
  regex: RegExp,
) => {
  return (
    symbol.toLowerCase().match(regex) ||
    displaySymbol?.toLowerCase().match(regex) ||
    description.toLowerCase().match(regex)
  );
};

const useStyles = makeStyles(() => ({
  wrapper: {
    flex: 1,
  },
}));

interface Props {
  dataType: DataTypeEnum;
}

export const BriefInfoList: React.FC<Props> = ({ dataType }) => {
  const dispatch = useDispatch<AppDispatch>();

  const dataConfigs = useSelector(dataConfigsSelectors.getDataConfigs);

  const { symbols } = useMemo(() => {
    return dataConfigs.find((c) => c.type === dataType)!;
  }, [dataConfigs, dataType]);

  useEffect(() => {
    dispatch(
      shortHistoricalActions.fetchShortHistoricalData(
        symbols.map((s) => s.symbol),
      ),
    );
  }, [symbols, dispatch]);

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = useCallback((nextTerm: string) => {
    setSearchTerm(nextTerm);
  }, []);

  const filteredSymbols = useMemo(() => {
    return symbols
      .filter((symbolConfig) => {
        const regex = new RegExp(searchTerm.toLowerCase(), 'i');
        return isMatched(symbolConfig, regex);
      })
      .sort((a, b) => {
        const regex = new RegExp(`^${searchTerm.toLowerCase()}`, 'i');
        const aStart = isMatched(a, regex);
        const bStart = isMatched(b, regex);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return 0;
      });
  }, [symbols, searchTerm]);

  const styles = useStyles();

  return (
    <View style={styles.wrapper}>
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <FlatList
        data={filteredSymbols}
        keyExtractor={(p) => p.symbol}
        renderItem={({ item }) => {
          return <BriefInfo symbolConfig={item} dataType={dataType} />;
        }}
      />
    </View>
  );
};
