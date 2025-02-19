import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './MoneyCounterStyles';

interface MoneyCounterProps {
  value: number;
}

const MoneyCounter: React.FC<MoneyCounterProps> = ({ value }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/plus.png')} style={styles.plusIcon}/>
      <Text style={styles.moneyText}>{value}</Text>
      <Image source={require('./assets/coins.png')} style={styles.moneyIcon} />
    </View>
  );
};

export default MoneyCounter;
