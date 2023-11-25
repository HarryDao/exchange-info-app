import { BriefInfoList } from 'src/components/BriefInfoList/BriefInfoList';
import { ScreenWrapper } from 'src/components/ScreenWrapper/ScreenWrapper';
import { DataTypeEnum } from 'src/types';

export const StockScreen = () => {
  return (
    <ScreenWrapper>
      <BriefInfoList dataType={DataTypeEnum.STOCK} />
    </ScreenWrapper>
  );
};
