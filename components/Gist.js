import React from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';

const Gist = ({gist, showImage}) => {
  return (
    <TouchableOpacity
      onPress={() => showImage(gist.avatar_url)}
      style={styles.container}>
      <View style={styles.wrapper}>
        <Image source={{uri: gist.avatar_url}} style={styles.image} />
        <Text style={styles.fileName}>{gist.filename}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    borderBottomWidth: 1,
    justifyContent: 'center',
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 2,
    borderBottomWidth: 0.8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  fileNameContainer: {
    flexDirection: 'column',
    marginLeft: 25,
    maxWidth: '80%',
  },
  fileName: {
    marginLeft: 25,
    maxWidth: '80%',
    fontFamily: 'HelveticaNeue',
    color: '#000000',
    fontSize: 15,
  },
});

export default React.memo(Gist);
