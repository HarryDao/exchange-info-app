import { ImageBackground, StyleSheet, View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { IMAGES } from 'src/images';

const useStyles = makeStyles(() => {
  return {
    outerView: {
      flex: 1,
      flexDirection: 'column',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
  };
});

interface BackgroundProps {
  children?: React.ReactNode;
  outerViewStyle: StyleSheet.NamedStyles<any>;
  backgroundImageStyle: StyleSheet.NamedStyles<any>;
}

export const Background: React.FC<BackgroundProps> = ({
  outerViewStyle,
  backgroundImageStyle,
  children,
}) => {
  const styles = useStyles();

  return (
    <View style={[styles.outerView, outerViewStyle]}>
      <ImageBackground
        source={IMAGES.background}
        style={[styles.backgroundImage, backgroundImageStyle]}
        blurRadius={10}
      >
        {children}
      </ImageBackground>
    </View>
  );
};
