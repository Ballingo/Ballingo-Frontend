import React, { useEffect, useState } from "react";
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
import { getActiveTrades } from "@/api/trade_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FoodImageMap } from "@/utils/imageMap";
import { acceptTrade } from "@/api/trade_api";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { addClothesToPet, getPetClothes } from "@/api/pet_api";
import { PetSkinImageMap } from "@/utils/imageMap";
import LoadingScreen from "@/components/loading-screen/LoadingScreen";

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

interface Category {
  name: string;
  image: any;
}

interface InventoryProps {
  categories: Category[];
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
    categories[0].name
  );
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(
    allItems ?? items
  );
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [previousItem, setPreviousItem] = useState<InventoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tradeStep, setTradeStep] = useState<"initial" | "select" | "confirm">(
    "initial"
  );
  const [isTrading, setIsTrading] = useState<boolean>(false);
  const [showTrades, setShowTrades] = useState<boolean>(false);

  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [selectedClothes, setSelectedClothes] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [actualLanguage, setActualLanguage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);

      const fetchClothes = async () => {
        try {
          const storedPetId = await AsyncStorage.getItem("PetId");
          if (!storedPetId) {
            console.error("❌ No se encontró el ID de la mascota.");
            return;
          }

          const { data, status } = await getPetClothes(storedPetId);
          if (status === 200 && data.accesories) {
            const petClothesIds = data.accesories.map(
              (item: { id: number }) => item.id.toString()
            );
            setSelectedClothes(petClothesIds);
          }
        } catch (error) {
          console.error("❌ Error en fetchClothes:", error);
        } finally {
          setIsLoading(false); // Se actualiza el estado al terminar la carga
        }
      };

      fetchClothes();
    }, [])
  );

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem("ActualLanguage");
      setActualLanguage(storedLanguage || "en");
    };

    fetchLanguage();
  }, []);

  // Ejemplo de trades activos
  const [activeTrades, setActiveTrades] = useState<TradeItem[]>([]);

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
  const handleSelectItem = async (item: InventoryItem) => {
    setSelectedItem(item);
    if (isClothes) {
      const storedPetId = await AsyncStorage.getItem("PetId");
      if (!storedPetId) {
        console.error("❌ No se encontró el ID de la mascota.");
        return;
      }

      console.log(`👕 Adding item (${item.id}) to pet (${storedPetId})...`);

      const { data, status } = await addClothesToPet(storedPetId, item.id);

      if (status === 200) {
        if (item.id !== "0") {
          console.log("✅ Clothes added to your pet:", data);

          setSelectedClothes(() => {
            const updatedSelection = data.accesories.map(
              (clothes: { id: number }) => clothes.id.toString()
            );
            return updatedSelection;
          });

          //alert("✅ Clothes added to pet.");
        } else {
          console.log("✅ All clothes removed: ", data);
          alert("✅ Removed all clothes from your pet.");
          setSelectedClothes([]);
        }
      } else {
        console.error("❌ Error:", data);
        alert("❌ Could not add clothes to your pet.");
      }
    } else {
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
    setFilteredItems(allItems ?? items);
    setShowTrades(false); // Cierra también la vista de trades
  };

  // Iniciar Trade y cargar todos los ítems
  const handleTrade = () => {
    if (selectedItem) {
      setPreviousItem(selectedItem);
    }
    setIsTrading(true);
    setModalVisible(false);

    const updatedItems = (allItems ?? items).filter(
      (item) => item.id !== selectedItem?.id
    );

    setFilteredItems(updatedItems);
    setTradeStep("select");
  };

  // Mostrar trades activos
  const handleShowTrades = async () => {
    if (!selectedItem) {
      alert("❌ Debes seleccionar un ítem primero.");
      return;
    }

    await fetchActiveTrades(selectedItem.id);
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

      const storedPlayerId = await AsyncStorage.getItem("PlayerId");
      if (!storedPlayerId) {
        alert("❌ No se encontró el ID del jugador.");
        return;
      }

      const playerId = parseInt(storedPlayerId, 10);
      const inFoodId = parseInt(previousItem.id, 10);
      const outFoodId = parseInt(selectedItem.id, 10);

      const tradeData = {
        player_id: playerId,
        isActive: true,
        in_food_id: inFoodId,
        out_food_id: outFoodId,
      };

      console.log("📌 Enviando Trade:", tradeData);

      const response = await createTrade(tradeData);

      if (response.status === 201) {
        alert("✅ Trade creado con éxito.");
        handleCloseModal();
      } else {
        console.error("❌ Error creando trade:", response.data);
        alert("❌ Hubo un error al crear el trade.");
      }
    } catch (error: any) {
      // 🔹 Forzamos `error` a tipo `any`
      console.error("❌ Error en la solicitud:", error);

      if (error.response) {
        console.log("🔍 Respuesta del servidor:", error.response.data);
        alert("❌ Error del servidor: " + JSON.stringify(error.response.data));
      } else {
        alert("❌ Error de conexión.");
      }
    }
  };

  const fetchActiveTrades = async (itemId?: string) => {
    try {
      console.log("🔹 Buscando trades activos...");
      const response = await getActiveTrades();

      if (response.status === 200) {
        console.log("✅ Trades activos obtenidos:", response.data);

        const filteredTrades = response.data.filter(
          (trade: any) => trade.in_food.id.toString() === itemId
        );

        const formattedTrades = filteredTrades.map((trade: any) => ({
          id: trade.id.toString(),
          itemName: trade.in_food.name,
          status: trade.isActive ? "Pendiente" : "Completado",
          userProfile: PetSkinImageMap[trade.player.actualLanguage],
          requestedImage: FoodImageMap[trade.out_food.image_path],
          offeredImage: FoodImageMap[trade.in_food.image_path],
        }));

        setActiveTrades(formattedTrades);
      } else {
        console.error("❌ Error obteniendo trades activos:", response.data);
      }
    } catch (error) {
      console.error("❌ Error en la solicitud de trades:", error);
    }
  };

  const handleAcceptTrade = async (tradeId: string) => {
    try {
      console.log(`📌 Aceptando trade con ID: ${tradeId}`);

      // Obtener el ID del jugador desde AsyncStorage
      const storedPlayerId = await AsyncStorage.getItem("PlayerId");
      if (!storedPlayerId) {
        alert("❌ No se encontró el ID del jugador.");
        return;
      }

      const playerId = parseInt(storedPlayerId, 10);

      // Llamada a la API para aceptar el trade
      const response = await acceptTrade(tradeId, playerId);

      if (response.status === 200) {
        alert("✅ Trade aceptado con éxito.");
        await fetchActiveTrades(); // Recargar trades después de aceptar uno
      } else {
        console.error("❌ Error aceptando trade:", response.data);
        alert(`❌ Hubo un error al aceptar el trade: ${response.data.error}`);
      }
    } catch (error) {
      console.error("❌ Error en la solicitud de aceptación:", error);
      alert("❌ Error de conexión.");
    }
  };

  const renderTrade = ({ item }: { item: TradeItem }) => {
    const isSelected = selectedTrade === item.id;

    console.log("🔹 Trade seleccionado:", item);

    return (
      <TouchableOpacity
        onPress={() => setSelectedTrade(isSelected ? null : item.id)} // Alternar selección
        style={[
          styles.tradeItem,
          isSelected && styles.expandedTrade, // Aplica estilo de expansión
        ]}
      >
        <View style={styles.tradeRow}>
          {/* Imagen de perfil a la izquierda */}
          <Image source={item.userProfile} style={styles.profileImage} />

          {/* Contenido del trade */}
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

        {/* Mostrar el botón solo si está expandido */}
        {isSelected && (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptTrade(item.id)}
          >
            <Text style={styles.acceptButtonText}>Aceptar</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        !isClothes && styles.redBackground,
        isClothes && styles.orangeBackground,
      ]}
      key={refreshKey}
    >

      {isLoading && (
        <Modal transparent={true} visible={true}>
          <View style={{ flex: 1 }}>
            <LoadingScreen />
          </View>
        </Modal>
      )}

      {!showTrades && (
        <View
          style={[
            styles.navbar,
            !isClothes && styles.redNavbar,
            isClothes && styles.orangeNavbar,
          ]}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.navButton,
                selectedCategory === category.name &&
                  !isTrading &&
                  !isClothes &&
                  styles.redActiveButton,
                selectedCategory === category.name &&
                  isClothes &&
                  styles.orangeActiveButton,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Image
                source={category.image}
                style={[styles.navImage, !isClothes && styles.tradeNavImage]}
              />
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
                selectedClothes.includes(item.id.toString()) &&
                  styles.selectedItem,
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
                        {/* Mostrar "Create" solo si el usuario tiene el ítem */}
                        {items.some((item) => item.id === selectedItem?.id) && (
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
                        )}

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
                          <Image
                            source={previousItem.image}
                            style={styles.modalImage2}
                          />
                        </View>

                        <Ionicons
                          name="arrow-forward"
                          size={30}
                          color="#333"
                          style={styles.arrowIcon}
                        />

                        <View style={styles.imageBox}>
                          <Image
                            source={selectedItem.image}
                            style={styles.modalImage2}
                          />
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleConfirmTrade}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={20}
                          color="#fff"
                          style={styles.iconStyle}
                        />
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
