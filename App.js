import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import axios from 'axios';
import Gist from './components/Gist';

const App = () => {
  const [gists, setGists] = useState([]);
  const [page, setPage] = useState(1);
  const [spinner, setSpinner] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    axios.defaults.headers.common['accept'] = 'application/vnd.github.v3+json';
    loadGits(1)
      .then(data => {
        if (data !== null) {
          setGists(data);
          setSpinner(false);
        }
      })
      .catch(e => {
        setSpinner(false);
        console.log(e);
        alert(e.message);
      });
  }, []);

  const loadMore = () => {
    setLoadingMore(true);
    loadGits(page + 1)
      .then(data => {
        if (data !== null) {
          setPage(page + 1);
          setLoadingMore(false);
          setGists(oldGists => [...oldGists, ...data]);
        }
      })
      .catch(e => {
        console.log(e);
        setLoadingMore(false);
        alert(e.message);
      });
  };

  const loadGits = async page => {
    const data = await axios
      .get(
        `https://api.github.com/gists/public?per_page=15&page=${page}&since=2020-12-01T00:00:00Z`,
      )
      .then(r => {
        const gists = r.data.map(user => {
          let gist = {};
          gist['id'] = user.id;
          gist['avatar_url'] = user.owner.avatar_url;
          gist['filename'] = Object.values(user.files)[0].filename;
          return gist;
        });
        return gists;
      })
      .catch(e => {
        console.log(e);
        alert(e.message);
        return null;
      });
    return data;
  };

  const showImage = image => {
    setSelectedImage(image);
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else return null;
  };

  const renderItem = ({item}) => {
    return <Gist gist={item} showImage={showImage} />;
  };

  // const keyExtractor=useCallback((item)=>item.id.toString(),[])
  const keyExtractor = useCallback((item, index) => index.toString());

  const onEndReached = () => {
    if (!loadingMore) {
      loadMore();
    }
  };

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 70,
      offset: 70 * index,
      index,
    }),
    [],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      {spinner ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{alignSelf: 'center', height: '100%'}}
        />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Gists</Text>
          </View>
          <FlatList
            data={gists}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReachedThreshold={0.2}
            onEndReached={onEndReached}
            initialNumtoRender={15}
            removeClippedSubviews={true}
            maxToRenderPerBatch={14}
            windowSize={14}
            getItemLayout={getItemLayout}
            ListFooterComponent={renderFooter}
          />
          {selectedImage !== null && (
            <Animated.View
              style={[styles.imageContainer, {opacity: fadeAnimation}]}>
              <Image source={{uri: selectedImage}} style={styles.image} />
            </Animated.View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F3F3F3',
    width: '100%',
    height: 28,
    justifyContent: 'center',
  },
  footer: {
    position: 'relative',
    width: 30,
    height: 30,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 50,
    borderColor: 'red',
    alignSelf: 'center',
  },
  title: {
    marginLeft: 16,
    fontFamily: 'Helvetica-Bold',
  },
  imageContainer: {
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default App;
