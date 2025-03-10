import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  fullScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 1000, // Asegura que esté encima de todo
    backgroundColor: "white", // O el color de fondo que prefieras
    
  },

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
    zIndex: 20,
    pointerEvents: 'auto',
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
