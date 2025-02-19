import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-end',
    paddingInline: 10,
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    alignSelf: 'flex-end',
    margin: 20,
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
