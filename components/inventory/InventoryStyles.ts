import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    width: '80%',
    height: height * 0.5,
    borderRadius: 5,
  },
  redBackground: {
    borderWidth: 2,
    borderColor: '#FF0000',
    backgroundColor: '#FF6565',
  },
  orangeBackground: {
    borderWidth: 2,
    borderColor: '#FF8700',
    backgroundColor: '#FFB45C',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  redNavbar: {
    backgroundColor: '#FF4C4C',
    borderBottomWidth: 1,
    borderColor: '#FF0000',
  },
  orangeNavbar: {
    backgroundColor: '#FFA945',
    borderBottomWidth: 1,
    borderColor: '#FF8700',
  },
  redActiveButton: {
    backgroundColor: '#FF2E2E',
  },
  orangeActiveButton: {
    backgroundColor: '#FF9315',
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

  closeButton: {
    position: 'absolute',
    paddingVertical: 4,
    paddingHorizontal: 7,
    top: 7,
    right: 7,
    borderRadius: 20,
    backgroundColor: '#ff4d4d',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginVertical: 5,
    alignItems: 'center',
    width: '40%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  tradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  
  imageBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  modalImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  modalImage2: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
  },

  
  arrowIcon: {
    marginHorizontal: 10,
  },
  
  iconStyle: {
    marginRight: 8,
  },

  
  tradeItem: {
    width: '90%',        // Ancho del 90%
    alignSelf: 'center', // Centra el ítem dentro del contenedor padre
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },

  tradeText: {
    fontSize: 14,
    color: '#333',
  },
  tradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  tradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
    marginLeft: 10,
  },

  tradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Alinea los elementos a la izquierda
    flex: 1, // Permite que los ítems ocupen el espacio restante
    marginLeft: 10,
  },
  
  tradeImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'contain',
  },

tradeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // Distribuye los elementos a lo largo de la fila
  width: '100%',
},


backButton: {
  flexDirection: 'row',   
  justifyContent: 'center',
  alignItems: 'center',
  width: '60%',       
  paddingVertical: 10, 
  borderRadius: 10,
  backgroundColor: '#007AFF', 
  alignSelf: 'center', 
  marginTop: 10, 
  marginBottom: 10,
},

expandedTrade: {
  paddingVertical: 20, // Aumenta el espacio interno al expandirse
  backgroundColor: "#fff", // 🔹 Mantener el color blanco del fondo
  borderRadius: 10, // Bordes redondeados
  marginBottom: 10, // Espaciado entre elementos
  elevation: 3, // Mantener sombra al expandir
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},


acceptButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#28a745",
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8, 
  marginTop: 15,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},

acceptButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 10,
},



  

});
