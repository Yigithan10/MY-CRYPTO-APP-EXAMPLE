import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  Modal,
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  useColorScheme,
  AppState,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import io from 'socket.io-client';
import RNExitApp from 'react-native-kill-app';
import Card from './src/components/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BarChart} from 'react-native-chart-kit';

const socket = io('http://192.168.1.42:3000');

socket.on('connect', () => {
  console.log('Socket Connected!');
});

const dimensions = Dimensions.get('screen');

const App = () => {
  const [data, setData] = useState([]);
  const [isSpinner, setIsSpinner] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const [cryptoName, setCryptoName] = useState('');
  const [cryptoImage, setCryptoImage] = useState(null);
  const [cryptoCurrent_price, setCryptoCurrent_price] = useState(0);
  const [
    cryptoPrice_change_percentage_24h,
    setCryptoPrice_change_percentage_24h,
  ] = useState(0);
  const [cryptoSparkline_in_7d, setCryptoSparkline_in_7d] = useState(null);
  const [cryptolow_24h, setCryptoLow_24h] = useState(0);
  const [cryptoHigh_24h, setCryptoHigh_24h] = useState(0);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const colorScheme = useColorScheme();

  const color = colorScheme === 'dark' ? 'white' : 'black';
  const backColor = colorScheme === 'dark' ? 'black' : 'white';

  useEffect(() => {
    socket.on('crypto', cryptoData => {
      if (cryptoData.length !== 0) {
        setData(cryptoData);
      }
    });
  }, []);

  useEffect(() => {
    if (data.length !== 0) {
      setIsSpinner(false);
    } else {
      setIsSpinner(true);
    }
  }, [data]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (appStateVisible == 'background') {
      RNExitApp.exitApp();
    }
  }, [appStateVisible]);

  const dataChart = {
    labels: ['Last7', 'Last6', 'Last5', 'Last4', 'Last3', 'Last2', 'Last1'],
    datasets: [
      {
        data: modalVisible ? cryptoSparkline_in_7d.price : [],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      },
    ],
    legend: ['Last 7 Days ' + cryptoName], // optional
  };

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(20, 161, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const Action = () => {
    return (
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <SafeAreaView style={{flex: 1, backgroundColor: backColor}}>
          <View
            key={cryptoName}
            style={[
              styles.item,
              {
                backgroundColor: backColor === 'black' ? '#585858' : '#DBDBDB',
              },
            ]}>
            <TouchableOpacity style={styles.close}>
              <Ionicons
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                name={'close-outline'}
                size={30}
                color={color}
              />
            </TouchableOpacity>
            <View style={styles.itemTitle}>
              <View style={styles.itemTitleLeft}>
                <Image
                  style={[styles.image, {marginRight: 5}]}
                  source={{uri: cryptoImage}}
                />
                <Text style={[styles.name, {color: color}]}>{cryptoName}</Text>
              </View>
              <Text style={[styles.current_price, {color: color}]}>
                {Math.round(cryptoCurrent_price * 1000) / 1000}
              </Text>
            </View>
            <View style={styles.itemInformation}>
              <View style={styles.itemInformationLeft}>
                <Text
                  style={[
                    styles.low_24h,
                    {color: color === 'white' ? '#C1C1C1' : '#727272'},
                  ]}>
                  {'24h min: ' + Math.round(cryptolow_24h * 1000) / 1000}
                </Text>
                <Text
                  style={[
                    styles.high_24h,
                    {color: color === 'white' ? '#C1C1C1' : '#727272'},
                  ]}>
                  {'24h max: ' + Math.round(cryptoHigh_24h * 1000) / 1000}
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.price_change_percentage_24h,
                    {
                      color:
                        cryptoPrice_change_percentage_24h > 0.01
                          ? 'green'
                          : cryptoPrice_change_percentage_24h < -0.01
                          ? 'red'
                          : 'gray',
                    },
                  ]}>
                  {'%' +
                    Math.round(cryptoPrice_change_percentage_24h * 100) / 100}
                </Text>
              </View>
            </View>
            {cryptoSparkline_in_7d.price && (
              <View style={styles.chart}>
                <BarChart
                  data={dataChart}
                  width={dimensions.width * 0.9}
                  height={dimensions.height * 0.6}
                  chartConfig={chartConfig}
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const actionHandler = (
    itemName,
    itemImage,
    itemPrice,
    itemChange24h,
    itemSparkline,
    itemHigh,
    itemLow,
  ) => {
    setCryptoName(itemName);
    setCryptoImage(itemImage);
    setCryptoCurrent_price(itemPrice);
    setCryptoPrice_change_percentage_24h(itemChange24h);
    setCryptoSparkline_in_7d(itemSparkline);
    setCryptoLow_24h(itemHigh);
    setCryptoHigh_24h(itemLow);

    setModalVisible(!modalVisible);
  };

  // symbol: item.symbol,
  // market_cap_rank: item.market_cap_rank,

  return (
    <React.Fragment>
      <SafeAreaView style={[styles.container, {backgroundColor: backColor}]}>
        <StatusBar
          animated={true}
          backgroundColor={
            modalVisible ? 'gray' : colorScheme === 'dark' ? 'black' : 'white'
          }
          barStyle={'dark-content'}
          translucent={true}
        />

        {data.length !== 0 && !isSpinner && (
          <FlatList
            data={data}
            renderItem={({item}) => (
              <Card
                onPress={() => {
                  actionHandler(
                    item.name,
                    item.image,
                    item.current_price,
                    item.price_change_percentage_24h,
                    item.sparkline_in_7d,
                    item.low_24h,
                    item.high_24h,
                  );
                }}
                item={item}
              />
            )}
          />
        )}

        {data.length === 0 && isSpinner && (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color={color} />
          </View>
        )}

        {modalVisible && Action()}
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
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
    marginTop: 25,
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
  chart: {
    marginTop: 50,
  }
});

export default App;
