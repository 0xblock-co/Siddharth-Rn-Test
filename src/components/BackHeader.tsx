import CustomImage from './CustomImage';
import { IMAGES } from '../assets/images';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/Colors';
import { commonFontStyle, hp, wp } from '../utils/responsiveFn/responsiveFn';
import { StyleSheet, Text, View } from 'react-native';

interface BackHeaderProps {
  title: string;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <CustomImage
        source={IMAGES.backArrow2}
        size={wp(25)}
        onPress={() => navigation.goBack()}
        containerStyle={styles.backButton}
      />
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ width: wp(40) }} />
    </View>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  header: {
    height: hp(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_B9,
    paddingHorizontal: wp(20),
  },
  headerTitle: {
    ...commonFontStyle(700, 2.5, Colors.black),
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: wp(24),
    color: Colors.black,
    fontWeight: 'bold',
  },
});
