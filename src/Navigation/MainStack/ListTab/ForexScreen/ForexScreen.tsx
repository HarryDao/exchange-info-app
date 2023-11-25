import { Text } from '@rneui/base';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BriefInfoList } from 'src/components/BriefInfoList/BriefInfoList';
import { ScreenWrapper } from 'src/components/ScreenWrapper/ScreenWrapper';
import { DataTypeEnum } from 'src/types';

interface Props {}

export const ForexScreen: React.FC<Props> = () => {
  return (
    <ScreenWrapper>
      <BriefInfoList dataType={DataTypeEnum.FOREX} />
    </ScreenWrapper>
  );
};
