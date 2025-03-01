import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import styles from "./InventoryStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createTrade } from "@/api/trade_api";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

interface TradeItem {
  id: string;
  itemName: string;
  status: string;
  userProfile: any;
  requestedImage: any;
  offeredImage: any;
}

interface InventoryProps {
  categories: string[];
  items: InventoryItem[];
  allItems?: InventoryItem[];
  isClothes?: boolean;
}




const Inventory: React.FC<InventoryProps> = ({
  categories,
  items,
  allItems,
  isClothes = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(items);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [previousItem, setPreviousItem] = useState<InventoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tradeStep, setTradeStep] = useState<"initial" | "select" | "confirm">(
    "initial"
  );
  const [isTrading, setIsTrading] = useState<boolean>(false);
  const [showTrades, setShowTrades] = useState<boolean>(false);
  


  
  // Ejemplo de trades activos
  const activeTrades: TradeItem[] = [
    {
      id: "1",
      itemName: "Manzana",
      status: "Pendiente",
      userProfile: require("../pet/assets/moringo.png"),
      requestedImage: require("../../assets/inventory/food/ja/sushi.png"),
      offeredImage: require("../../assets/inventory/food/ja/sushi.png"),
    },
    {
      id: "2",
      itemName: "Plátano",
      status: "Completado",
      userProfile: require("../pet/assets/moringo.png"),
      requestedImage: require("../../assets/inventory/food/ja/sushi.png"),
      offeredImage: require("../../assets/inventory/food/ja/sushi.png"),
    },
    {
      id: "3",
      itemName: "Plátano",
      status: "Completado",
      userProfile: require("../pet/assets/moringo.png"),
      requestedImage: require("../../assets/inventory/food/ja/sushi.png"),
      offeredImage: require("../../assets/inventory/food/ja/sushi.png"),
    },
    {
      id: "4",
      itemName: "Plátano",
      status: "Completado",
      userProfile: require("../pet/assets/moringo.png"),
      requestedImage: require("../../assets/inventory/food/ja/sushi.png"),
      offeredImage: require("../../assets/inventory/food/ja/sushi.png"),
    },
    {
      id: "5",
      itemName: "Plátano",
      status: "Completado",
      userProfile: require("../pet/assets/moringo.png"),
      requestedImage: require("../../assets/inventory/food/ja/sushi.png"),
      offeredImage: require("../../assets/inventory/food/ja/sushi.png"),
    },
    {
      id: "6",
      itemName: "Plátano",
      status: "Completado",
      userProfile: require("../pet/assets/moringo.png"),
      requestedImage: require("../../assets/inventory/food/ja/sushi.png"),
      offeredImage: require("../../assets/inventory/food/ja/sushi.png"),
    },
    {
      id: "7",
      itemName: "Plátano",
      status: "Completado",
      userProfile: require("../pet/assets/moringo.png"),
      requestedImage: require("../../assets/inventory/food/ja/sushi.png"),
      offeredImage: require("../../assets/inventory/food/ja/sushi.png"),
    },
    {
      id: "8",
      itemName: "Plátano",
      status: "Completado",
      userProfile: require("../pet/assets/moringo.png"),
      requestedImage: require("../../assets/inventory/food/ja/sushi.png"),
      offeredImage: require("../../assets/inventory/food/ja/sushi.png"),
    },
  ];

  // Obtener ítems con not-allowed si es ropa
  const getFilteredItems = () => {
    const baseItems = filteredItems.filter(
      (item) => item.category === selectedCategory
    );
    if (isClothes && !isTrading) {
      return [
        {
          id: "0",
          category: selectedCategory,
          image: require("./assets/not-allowed.png"),
        },
        ...baseItems,
      ];
    }
    return baseItems;
  };

  // Manejar la selección de ítems
  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    if (!isClothes) {
      setModalVisible(true);
      setTradeStep(isTrading ? "confirm" : "initial");
    }
  };

  // Cerrar modal y resetear todo
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setPreviousItem(null);
    setTradeStep("initial");
    setIsTrading(false);
    setFilteredItems(items);
    setShowTrades(false); // Cierra también la vista de trades
  };

  // Iniciar Trade y cargar todos los ítems
  const handleTrade = () => {
    if (selectedItem) {
      setPreviousItem(selectedItem);
    }
    setIsTrading(true);
    setModalVisible(false);
    setFilteredItems(allItems ?? items);
    setTradeStep("select");
  };



  // Mostrar trades activos
  const handleShowTrades = () => {
    setShowTrades(true);
    setModalVisible(false);
  };

  // Confirmar Trade
  // Confirmar Trade y enviarlo a la API
    const handleConfirmTrade = async () => {
      if (!previousItem || !selectedItem) {
          alert("❌ Debes seleccionar dos ítems para intercambiar.");
          return;
      }

      try {
          console.log("📌 Confirmar Trade:", previousItem, selectedItem);
          // Obtener el ID del jugador desde AsyncStorage
          const storedPlayerId = await AsyncStorage.getItem("PlayerId");
          if (!storedPlayerId) {
              alert("❌ No se encontró el ID del jugador.");
              return;
          }

          const playerId = parseInt(storedPlayerId, 10);
          const inFoodId = parseInt(previousItem.id, 10);  // Convertir a número
          const outFoodId = parseInt(selectedItem.id, 10); // Convertir a número

          // Estructura del JSON enviado
          const tradeData = {
              player: playerId,
              isActive: true,  // Se asume que el Trade está activo por defecto
              in_food: inFoodId,
              out_food: outFoodId
          };

          console.log("📌 Enviando Trade:", tradeData);

          // Crear el trade en el backend
          const response = await createTrade(tradeData);

          if (response.status === 201) {
              alert("✅ Trade creado con éxito.");
              handleCloseModal();
          } else {
              console.error("❌ Error creando trade:", response.data);
              alert("❌ Hubo un error al crear el trade.");
          }
      } catch (error) {
          console.error("❌ Error en la solicitud:", error);
          alert("❌ Error de conexión.");
      }
  };



  // Renderizar ítem
  const renderItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedItem?.id === item.id && styles.selectedItem,
      ]}
      onPress={() => handleSelectItem(item)}
    >
      <Image source={item.image} style={styles.itemImage} />
    </TouchableOpacity>
  );

  // Renderizar cada trade activo
  const renderTrade = ({ item }: { item: TradeItem }) => (
    <View style={styles.tradeItem}>
      <View style={styles.tradeRow}>
        {/* Imagen de perfil a la izquierda */}
        <Image source={item.userProfile} style={styles.profileImage} />

        {/* Contenido del trade a la derecha */}
        <View style={styles.tradeContent}>
          <Image source={item.requestedImage} style={styles.tradeImage} />
          <Ionicons
            name="arrow-forward"
            size={30}
            color="#555"
            style={styles.arrowIcon}
          />
          <Image source={item.offeredImage} style={styles.tradeImage} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!showTrades && (
        <View style={styles.navbar}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.navButton,
                selectedCategory === category && styles.activeNavButton,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.navText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Grid de Ítems o Trades Activos */}
      {!showTrades ? (
        <FlatList
          data={getFilteredItems()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.itemContainer,
                selectedItem?.id === item.id && styles.selectedItem,
              ]}
              onPress={() => handleSelectItem(item)}
            >
              <Image source={item.image} style={styles.itemImage} />
            </TouchableOpacity>
          )}
          numColumns={4}
          contentContainerStyle={styles.grid}
        />
      ) : (
        <>
          <Text style={styles.tradeTitle}>Trades Activos</Text>
          <FlatList
            data={activeTrades}
            keyExtractor={(item) => item.id}
            renderItem={renderTrade}
            contentContainerStyle={{ width: "100%" }}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowTrades(false)}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#fff"
              style={styles.iconStyle}
            />
            <Text style={styles.buttonText}>Volver al Inventario</Text>
          </TouchableOpacity>
        </>
      )}

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
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {selectedItem && (
                <>
                  {tradeStep === "initial" && (
                    <>
                      <View style={styles.imageBox}>
                        <Image
                          source={selectedItem.image}
                          style={styles.modalImage}
                        />
                      </View>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={handleTrade}
                        >
                          <Ionicons
                            name="add-circle-outline"
                            size={20}
                            color="#fff"
                            style={styles.iconStyle}
                          />
                          <Text style={styles.buttonText}>Create</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={handleShowTrades}
                        >
                          <Ionicons
                            name="search-outline"
                            size={20}
                            color="#fff"
                            style={styles.iconStyle}
                          />
                          <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {tradeStep === "confirm" && previousItem && (
                      <>
                          <View style={styles.tradeContainer}>
                              <View style={styles.imageBox}>
                                  <Image source={previousItem.image} style={styles.modalImage2} />
                              </View>

                              <Ionicons name="arrow-forward" size={30} color="#333" style={styles.arrowIcon} />

                              <View style={styles.imageBox}>
                                  <Image source={selectedItem.image} style={styles.modalImage2} />
                              </View>
                          </View>

                          <TouchableOpacity style={styles.modalButton} onPress={handleConfirmTrade}>
                              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={styles.iconStyle} />
                              <Text style={styles.buttonText}>Confirmar Trade</Text>
                          </TouchableOpacity>
                      </>
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
