import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import styles from './InventoryStyles';

interface InventoryItem {
  id: string;
  category: string;
  image: any;
}

interface InventoryProps {
  categories: string[];
  items: InventoryItem[];
}

const Inventory: React.FC<InventoryProps> = ({ categories, items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const filteredItems = [
    { id: '0', category: 'all', image: require('./assets/not-allowed.png') },
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

      {/* Grid de Ítems */}
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
