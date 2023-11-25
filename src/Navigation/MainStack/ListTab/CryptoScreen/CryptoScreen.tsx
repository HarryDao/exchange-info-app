import { Text } from '@rneui/base';
import { BriefInfoList } from 'src/components/BriefInfoList/BriefInfoList';
import { ScreenWrapper } from 'src/components/ScreenWrapper/ScreenWrapper';
import { DataTypeEnum } from 'src/types';

export const CryptoScreen = () => {
  return (
    <ScreenWrapper>
      <BriefInfoList dataType={DataTypeEnum.CRYPTO} />
    </ScreenWrapper>
  );
};
