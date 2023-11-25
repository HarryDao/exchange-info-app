import { Icon, makeStyles } from '@rneui/base';
import { SearchBar as RNSearchBar } from '@rneui/themed';
import { COLORS } from 'src/constants';

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: 'transparent',
    borderBlockColor: 'transparent',
  },
  input: {
    color: COLORS.white,
  },
  leftIcon: {
    color: COLORS.white,
    fontWeight: '600',
  },
}));

interface Props {
  searchTerm: string;
  onSearchChange: (nextTerm: string) => any;
}

export const SearchBar: React.FC<Props> = ({ searchTerm, onSearchChange }) => {
  const styles = useStyles();

  return (
    <RNSearchBar
      placeholder='Search...'
      value={searchTerm}
      onChangeText={onSearchChange}
      searchIcon={<Icon type='evillcons' name='search' color={COLORS.white} />}
      round
      showCancel
      containerStyle={styles.container}
      inputStyle={styles.input}
    />
  );
};
