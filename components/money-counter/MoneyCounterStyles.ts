import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingInline: 10,
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 20,
    alignSelf: 'flex-end',
    margin: 20,
  },
  moneyBackground: {
    backgroundColor: 'rgba(240, 240, 240, 0.75)'
  },
  moneyIcon: {
    width: 32,
    height: 32,
  },
  moneyText: {
    fontSize: 25,
    padding: 5,
  },
  plusIcon: {
    width: 25,
    height: 25,
  },
});

export default styles;
