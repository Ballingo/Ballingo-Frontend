import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '60%',
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#aaa',
  },
  barBackground: {
    width: '100%',
    height: 30,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#ddd',
    position: 'absolute',
    right: 0,
  },
  icon: {
    position: 'absolute', 
    top: -7,
    width: 50,
    height: 50,
    transform: [{ translateX: -30 }],
    zIndex: 2,
  },
});

export default styles;
