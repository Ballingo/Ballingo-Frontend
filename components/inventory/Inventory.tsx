import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import styles from './InventoryStyles';

interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

interface InventoryProps {
  categories: string[];
  items: InventoryItem[];
  allItems?: InventoryItem[];
  isClothes?: boolean;
}

const Inventory: React.FC<InventoryProps> = ({ categories, items, allItems, isClothes = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(items);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tradeStep, setTradeStep] = useState<'initial' | 'select' | 'confirm'>('initial');
  const [isTrading, setIsTrading] = useState<boolean>(false);

  // Obtener ítems con not-allowed si es ropa
  const getFilteredItems = () => {
    const baseItems = filteredItems.filter(item => item.category === selectedCategory);
    if (isClothes && !isTrading) {
      return [{ id: '0', category: selectedCategory, image: require('./assets/not-allowed.png') }, ...baseItems];
    }
    return baseItems;
  };

  // Manejar la selección de ítems
  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);

    // Si es ropa, solo resalta el ítem sin pop-up de trade
    if (!isClothes) {
      setModalVisible(true);
      setTradeStep(isTrading ? 'confirm' : 'initial');
    }
  };

  // Cerrar modal y resetear todo
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setTradeStep('initial');
    setIsTrading(false);
    setFilteredItems(items);
  };

  // Iniciar Trade y cargar todos los ítems
  const handleTrade = () => {
    setIsTrading(true);
    setModalVisible(false);
    setFilteredItems(allItems ?? items);
    setTradeStep('select');
  };

  // Confirmar Trade
  const handleConfirmTrade = () => {
    alert('Trade confirmado exitosamente.');
    handleCloseModal();
  };

  // Renderizar ítem
  const renderItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedItem?.id === item.id && styles.selectedItem
      ]}
      onPress={() => handleSelectItem(item)}
    >
      <Image source={item.image} style={styles.itemImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Navbar de Categorías */}
      <View style={styles.navbar}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.navButton,
              selectedCategory === category && styles.activeNavButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.navText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid de Ítems (incluye not-allowed si es ropa) */}
      <FlatList
        data={getFilteredItems()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={4}
        contentContainerStyle={styles.grid}
      />

      {/* Modal para el ítem seleccionado (solo si no es ropa) */}
      {!isClothes && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              {/* Botón de Cerrar (X) */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {selectedItem && (
                <>
                  <Image source={selectedItem.image} style={styles.modalImage} />
                  <Text style={styles.itemText}>Item: {selectedItem.category}</Text>

                  {/* Lógica del modal según la etapa */}
                  {tradeStep === 'initial' && (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.modalButton} onPress={handleTrade}>
                        <Text style={styles.buttonText}>Trade</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.modalButton} onPress={() => alert('Create action')}>
                        <Text style={styles.buttonText}>Create</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {tradeStep === 'select' && (
                    <View style={styles.buttonContainer}>
                      <Text style={styles.itemText}>Debe seleccionar la comida que quiere</Text>
                      <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.buttonText}>Seleccionar</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {tradeStep === 'confirm' && (
                    <View style={styles.buttonContainer}>
                      <Text style={styles.itemText}>¿Confirmar Trade?</Text>
                      <TouchableOpacity style={styles.modalButton} onPress={handleConfirmTrade}>
                        <Text style={styles.buttonText}>Confirmar</Text>
                      </TouchableOpacity>

                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Inventory;
