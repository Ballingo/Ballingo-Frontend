import { ImageBackground, View, Text } from "react-native";
import MoneyCounter from "@/components/money-counter/MoneyCounter";
import ProfileIcon from "@/components/profile-icon/ProfileIcon";
import { useEffect, useState } from "react";
import { getWardrobeByPlayer } from "@/api/inventory_api";
import { ClothesImageMap } from "@/utils/imageMap";
import Pet from "@/components/pet/Pet";
import Inventory from "@/components/inventory/Inventory";

interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

export default function Wardrobe() {
  const [clothes, setClothes] = useState<InventoryItem[]>([]);
  const playerId = 3;

  const mockClothes: InventoryItem[] = [
    {
      id: "1",
      category: "hats",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "2",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "3",
      category: "accesories",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "4",
      category: "hats",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "5",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "6",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "7",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "8",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "9",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "10",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "11",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "12",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "13",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "14",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "15",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "16",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "17",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "18",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "19",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "20",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "21",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
    {
      id: "22",
      category: "shirts",
      image: require("../../assets/inventory/wardrobe/shirts/shirt1.png"),
    },
  ];

  useEffect(() => {
    async function loadWardrobe() {
      console.log("🔹 Cargando wardrobe del jugador...");
      const response = await getWardrobeByPlayer(playerId);
  
      if (response.status === 200) {
        console.log("✅ Wardrobe cargado:", response.data);
  
        // Mapea los datos de la API al formato que necesita `Inventory`
        const formattedClothes = response.data.items.map((item: any) => {
          console.log("📌 Procesando item:", item); // Agregar log de cada ítem
  
          return {
            id: item.id.toString(),
            category: item.type, // Usa el tipo de ropa como categoría
            image: ClothesImageMap[item.image_path], // Manejo de imágenes
          };
        });
  
        setClothes(formattedClothes);
      } else {
        console.error("❌ Error al cargar wardrobe:", response.data);
      }
    }
  
    loadWardrobe();
  }, []);
  

  // ✅ Nuevo useEffect para imprimir `clothes` cuando se actualice
  useEffect(() => {
    if (clothes.length > 0) {
      console.log("📦 Wardrobe seteado en el estado:", clothes);
    }
  }, [clothes]); // Se ejecuta solo cuando `clothes` cambia

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/orange.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      {/* Contador de dinero y perfil */}
      <MoneyCounter value={100} color="FF8700" />
      <ProfileIcon size={50} style={{ zIndex: 10 }} />

      {/* Contenedor de mascota y barra de hambre */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: 100,
        }}
      >
        <Pet
          containerStyle={{
            alignItems: "center",
            marginBottom: 20,
          }}
          imageStyle={{
            width: 200,
            height: 200,
          }}
        />

        <Inventory
          categories={["hats", "shirts", "shoes", "accesories"]}
          items={clothes}
          isClothes={true}
        />
      </View>
    </ImageBackground>
  );
}
