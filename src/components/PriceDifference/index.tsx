import React, { useMemo } from 'react';

import { makeStyles } from '@rneui/base';
import { COLORS, TYPOS } from 'src/constants';
import { Text, View } from 'react-native';

const useStyles = makeStyles(() => ({
  wrapper: {
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    ...TYPOS.normal,
    fontWeight: '500',
  },
  textUp: {
    color: COLORS.greenBright,
  },
  textDown: {
    color: COLORS.redBright,
  },
}));

interface Props {
  last: number | null;
  current: number;
}

export const PriceDifference: React.FC<Props> = ({ last, current }) => {
  const styles = useStyles();

  const { text, textStyle } = useMemo(() => {
    let difference = 0;

    if (last !== null) {
      difference = (current - last) / last;
    }

    let diffText = `${(difference * 100).toPrecision(3)}%`;
    let addedStyle: any | undefined;

    if (difference === 0) {
      diffText = `+${diffText}`;
    } else if (difference > 0) {
      diffText = `+${diffText}`;
      addedStyle = styles.textUp;
    } else {
      addedStyle = styles.textDown;
    }

    return {
      text: diffText,
      textStyle: [styles.text, addedStyle],
    };
  }, [last, current]);

  return (
    <View style={styles.wrapper}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};
