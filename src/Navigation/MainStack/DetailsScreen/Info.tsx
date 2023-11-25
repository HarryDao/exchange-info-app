import { makeStyles, Text } from '@rneui/base';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { COLORS, TYPOS } from 'src/constants';
import { Current, MoreInfo, SymbolConfig } from 'src/types';

const useStyles = makeStyles(() => ({
  wrapper: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 40,
  },
  scrollView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  lineBorderUp: {
    borderTopColor: COLORS.grey_dark,
    borderTopWidth: 1,
  },
  key: {
    width: '50%',
    color: COLORS.white,
    ...TYPOS.normal,
  },
  value: {
    width: '50%',
    ...TYPOS.normal,
    color: COLORS.white,
    textAlign: 'right',
  },
  priceIncrease: {
    color: COLORS.greenBright,
  },
  priceDecrease: {
    color: COLORS.redBright,
  },
}));

interface Props {
  currentData: Current;
  moreInfo: MoreInfo;
}

export const Info: React.FC<Props> = ({ currentData, moreInfo }) => {
  const currentPrice = currentData.price;
  const previousCurrentPrice = useRef(currentPrice);

  const [priceStyle, setPriceStyle] = useState<any>({});
  const priceStyleResetTimeout = useRef<NodeJS.Timeout>();
  useEffect(() => {
    clearTimeout(priceStyleResetTimeout.current);
    if (currentPrice === previousCurrentPrice.current) return;
    if (currentPrice > previousCurrentPrice.current)
      setPriceStyle(styles.priceIncrease);
    if (currentPrice < previousCurrentPrice.current)
      setPriceStyle(styles.priceDecrease);

    previousCurrentPrice.current = currentPrice;
    priceStyleResetTimeout.current = setTimeout(() => {
      setPriceStyle({});
    }, 300);
  }, [currentPrice]);

  const styles = useStyles();

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.line}>
          <Text style={styles.key}>Current price</Text>
          <Text style={[styles.value, priceStyle]}>{currentPrice}</Text>
        </View>
        {Object.entries(moreInfo).map(([k, v]) => {
          return (
            <View key={k} style={[styles.line, styles.lineBorderUp]}>
              <Text style={styles.key}>{k}</Text>
              <Text style={styles.value}>{v}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
