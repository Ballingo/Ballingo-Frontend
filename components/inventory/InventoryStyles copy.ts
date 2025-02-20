import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    width: '80%',
    height: height * 0.5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: '#d9d9d9',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  navButton: {
    padding: 8,
    borderRadius: 5,
  },
  activeNavButton: {
    backgroundColor: '#555',
  },
  navText: {
    color: '#000',
    fontWeight: 'bold',
  },
  grid: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginInline: 5,
  },

  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 12,
    color: '#333',
  },

  selectedItem: {
    backgroundColor: '#ddd',

},
});
