import { StyleSheet } from 'react-native';

import Election from '@/components/Election';
import Map from '@/components/home2/Map';

export default function TabTwoScreen() {
  return (
   
   <>
   {/* <Election/> */}
   <Map/>
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
