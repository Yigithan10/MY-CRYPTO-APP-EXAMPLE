import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View, StyleSheet, Text, Image, useColorScheme} from 'react-native';

const Card = props => {
  const {onPress, item} = props;

  const colorScheme = useColorScheme();

  const color = colorScheme === 'dark' ? 'white' : 'black';
  const backColor = colorScheme === 'dark' ? 'black' : 'white';

  return (
    <TouchableOpacity
      key={item.id}
      onPress={onPress}
      style={[
        styles.item,
        {
          backgroundColor: backColor === 'black' ? '#585858' : '#DBDBDB',
        },
      ]}>
      <View style={styles.itemTitle}>
        <View style={styles.itemTitleLeft}>
          <Image
            style={[styles.image, {marginRight: 5}]}
            source={{uri: item.image}}
          />
          <Text style={[styles.name, {color: color}]}>{item.name}</Text>
        </View>
        <Text style={[styles.current_price, {color: color}]}>
          {Math.round(item.current_price * 1000) / 1000}
        </Text>
      </View>
      <View style={styles.itemInformation}>
        <View style={styles.itemInformationLeft}>
          <Text
            style={[
              styles.low_24h,
              {color: color === 'white' ? '#C1C1C1' : '#727272'},
            ]}>
            {'24h min: ' + Math.round(item.low_24h * 1000) / 1000}
          </Text>
          <Text
            style={[
              styles.high_24h,
              {color: color === 'white' ? '#C1C1C1' : '#727272'},
            ]}>
            {'24h max: ' + Math.round(item.high_24h * 1000) / 1000}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.price_change_percentage_24h,
              {
                color:
                  item.price_change_percentage_24h > 0.01
                    ? 'green'
                    : item.price_change_percentage_24h < -0.01
                    ? 'red'
                    : 'gray',
              },
            ]}>
            {'%' + Math.round(item.price_change_percentage_24h * 100) / 100}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 6,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'column',
  },
  itemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitleLeft: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  market_cap_rank: {
    fontSize: 18,
  },
  image: {
    width: 25,
    height: 25,
  },
  name: {
    fontSize: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  current_price: {
    fontSize: 20,
  },
  price_change_percentage_24h: {
    fontSize: 16,
  },
  itemInformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInformationLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  high_24h: {
    fontSize: 14,
    marginLeft: 15,
    marginRight: 5,
  },
  low_24h: {
    fontSize: 14,
  },
});

export default Card;
