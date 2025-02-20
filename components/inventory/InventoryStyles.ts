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

  // Modal general
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    paddingVertical: 5,
    paddingHorizontal: 10,
    top: 10,
    right: 10,
    borderRadius: 20,
    backgroundColor: '#ff4d4d',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});
