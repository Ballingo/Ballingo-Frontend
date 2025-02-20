import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import styles from './InventoryStyles';

interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

// Datos de ejemplo (imágenes deben ser importadas)
const items: InventoryItem[] = [
    { id: '0', category: 'all', image: require('./assets/not-allowed.png') },
    { id: '1', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '2', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '3', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '4', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '5', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '6', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '7', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '8', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '9', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '10', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '11', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '12', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '13', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '14', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '15', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '16', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '13', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '14', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '15', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '16', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '17', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '18', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '19', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '20', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '21', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '22', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '23', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '24', category: 'hats', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },
    { id: '25', category: 'shirts', image: require('../../assets/inventory/wardrobe/shirts/shirt1.png') },

];

const categories = ['hats', 'shirts', 'shoes', 'glasses'];

const Inventory: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('hats');
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
    const filteredItems = [
      items.find(item => item.id === '0')!,
      ...items.filter(item => item.category === selectedCategory)
    ];
  
    const handleSelectItem = (id: string) => {
      setSelectedItemId(prevId => (prevId === id ? null : id));
    };
  
    const renderItem = ({ item }: { item: InventoryItem }) => (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          selectedItemId === item.id && styles.selectedItem
        ]}
        onPress={() => handleSelectItem(item.id)}
      >
        <Image source={item.image} style={styles.itemImage} />
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
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
  
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={4}
          contentContainerStyle={styles.grid}
        />
      </View>
    );
  };
  
  export default Inventory;
