import { StyleSheet } from 'react-native';

import Election from '@/components/Election';
import Front from '@/components/Front';

export default function TabTwoScreen() {
  return (
   
   <>
   {/* <Election/> */}
   <Front/>
   </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
