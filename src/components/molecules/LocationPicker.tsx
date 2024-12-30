import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import AdIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

import { COLORS, FONTS, FONTSIZE } from '../../constants';
import { selectAppState } from '../../store/selectors/appSelector';
import { commonStyles } from '../../style';
import { getCurrentLocation } from '../../utils/Geolocation';
import { getItem, setItem } from '../../utils/localStorage';
import { getGeocode, getPlaceDetail, getPlaces } from '../../utils/utils';
import { Typography, InputText, Button } from '../atoms';

export const LocationPicker = (props: any) => {
  const { onSelect = () => { } } = props;
  const { service } = useSelector(selectAppState);
  const fieldRefs = useRef([]);

  const [suggestions, setSuggestions]: any = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [placeId, setPlaceId] = useState('');
  const [location, setLocation]: any = useState([]);
  const [searching, setSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [origin, setOrigin] = useState('');
  const [dropoff, setDropoff] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.length > 0 && placeId.length === 0) {
        setSearching(true);
        getPlaces(keyword).then((res: any) => {
          setSearching(false);
          setSuggestions([]);
          setPredictions(res.predictions);
        });
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [ keyword ]);

  const onClear = () => {
    fieldRefs['origin']?.isFocused() && setOrigin('');
    fieldRefs['dropoff']?.isFocused() && setDropoff('');
    setKeyword('');
    setPlaceId('');
    setPredictions([]);
    setLocation([]);
  };

  const getSuggestions = async () => {
    const data: any = await getItem('suggestions');
    if (data.length) setSuggestions([...data.reverse()]);
  }

  const getLocation = (ask: boolean = true) => {
    getCurrentLocation(ask)
      .then((res: any) => {
        setSearching(true);
      })
      .catch(err => {});
  };

  const selectPrediction = async (item: any) => {
    setSearching(true);

    fieldRefs['origin']?.isFocused() && setOrigin(item.description);
    fieldRefs['dropoff']?.isFocused() && setDropoff(item.description);

    setKeyword(item.description);
    setPlaceId(item.place_id);
    getPlaceDetail(item.place_id).then((res: any) => {
      const { lat, lng } = res.result.geometry.location;

      setPredictions([]);
      setPlaceId('');
      setSearching(false);

      if( fieldRefs['origin']?.isFocused() ){
        setOrigin(item.description);
        location[0] = {
          latitude: lat,
          longitude: lng,
          address: item.description,
        };
      }else if( fieldRefs['dropoff']?.isFocused() ){
        setDropoff(item.description);
        location[1] = {
          latitude: lat,
          longitude: lng,
          address: item.description,
        };
      }

      setLocation(location);
      onSelect(location);

      addSuggestion({
        latitude: lat,
        longitude: lng,
        address: item.description,
      })
    });
  };

  const selectSuggestion = async (item: any) => {
    setSearching(true);

    if( fieldRefs['origin']?.isFocused() ){
      setOrigin(item.address);
      location[0] = item;
    }else if( fieldRefs['dropoff']?.isFocused() ){
      setDropoff(item.address);
      location[1] = item;
    }

    setPredictions([]);
    setPlaceId('');
    setSearching(false);
    setSuggestions([]);

    setLocation(location);
    onSelect(location);
  };

  const _renderPicker = () => {
    switch (service._id) {
      case 1:
        return (<View style={{ ...styles.inputContainer, padding: 5 }}>
          <View style={{ ...styles.fieldContainer, flex: 1 }}>
            <TextInput
              style={styles.inputField}
              onChangeText={e => {
                setKeyword(e);
                setOrigin(e);
              }}
              value={origin}
              placeholder="Home Location"
              keyboardType="default"
              ref={e => (fieldRefs['origin'] = e)}
              onFocus={ () => getSuggestions() }
            />
            {origin ? (
              fieldRefs['origin'].isFocused() && (
                <>
                  {searching && (
                    <ActivityIndicator style={{ marginHorizontal: 5 }} />
                  )}
                  <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={onClear}>
                    <AdIcon
                      name={'closecircleo'}
                      size={20}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>
                </>
              )
            ) : (
              <TouchableOpacity onPress={() => getLocation()}>
                <Icon
                  name="my-location"
                  size={20}
                  color={COLORS.secondary}
                  style={{ letterSpacing: 5 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>)
      case 2:
        return (<View style={{ ...styles.inputContainer, padding: 5 }}>
          <View style={{ ...styles.fieldContainer, flex: 1 }}>
            <TextInput
              style={styles.inputField}
              onChangeText={e => {
                setKeyword(e);
                setOrigin(e);
              }}
              value={origin}
              placeholder="Home Location"
              keyboardType="default"
              ref={e => (fieldRefs['origin'] = e)}
              onFocus={ () => getSuggestions() }
            />
            {origin ? (
              fieldRefs['origin'].isFocused() && (
                <>
                  {searching && (
                    <ActivityIndicator style={{ marginHorizontal: 5 }} />
                  )}
                  <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={onClear}>
                    <AdIcon
                      name={'closecircleo'}
                      size={20}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>
                </>
              )
            ) : (
              <TouchableOpacity onPress={() => getLocation()}>
                <Icon
                  name="my-location"
                  size={20}
                  color={COLORS.secondary}
                  style={{ letterSpacing: 5 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>)
      case 3:
        return (<View style={styles.inputContainer}>
          <View
            style={{
              paddingHorizontal: 10,
              justifyContent: 'space-around',
            }}>
            <View style={styles.verticalBar} />
            <View style={styles.origin} />
            <View style={styles.dropOff} />
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.fieldContainer}>
              <TextInput
                style={styles.inputField}
                onChangeText={e => {
                  setKeyword(e);
                  setOrigin(e);
                }}
                value={origin}
                placeholder="Pick up"
                keyboardType="default"
                ref={e => (fieldRefs['origin'] = e)}
                onFocus={ () => getSuggestions() }
              />
              {origin ? (
                fieldRefs['origin'].isFocused() && (
                  <>
                    {searching && (
                      <ActivityIndicator style={{ marginHorizontal: 5 }} />
                    )}
                    <TouchableOpacity
                      style={{ justifyContent: 'center' }}
                      onPress={onClear}>
                      <AdIcon
                        name={'closecircleo'}
                        size={20}
                        color={COLORS.darkGray}
                      />
                    </TouchableOpacity>
                  </>
                )
              ) : (
                <TouchableOpacity onPress={() => getLocation()}>
                  <Icon
                    name="my-location"
                    size={20}
                    color={COLORS.secondary}
                    style={{ letterSpacing: 5 }}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.fieldLine} />

            <View style={styles.fieldContainer}>
              <TextInput
                style={styles.inputField}
                onChangeText={e => {
                  setKeyword(e);
                  setDropoff(e);
                }}
                value={dropoff}
                placeholder="Where to ?"
                keyboardType="default"
                ref={e => (fieldRefs['dropoff'] = e)}
                onFocus={ () => getSuggestions() }
              />
              {dropoff ? (
                fieldRefs['dropoff'].isFocused() &&
                searching && <ActivityIndicator style={{ marginHorizontal: 5 }} />
              ) : (
                <></>
              )}
              <AdIcon
                name="plus"
                size={20}
                color={COLORS.secondary}
                style={{ letterSpacing: 5 }}
              />
            </View>
          </View>
        </View>)
    }
  }

  const removeSuggestion = (item) => {
    const sugIndex = suggestions.findIndex((i: any) => i.address == item.address);
    if (sugIndex != -1) {
      suggestions.splice(sugIndex, 1);
    }
    setItem('suggestions', [...suggestions])
    setSuggestions([...suggestions])
  }

  const addSuggestion = async (item) => {
    const data: any = await getItem('suggestions');
    const index = data.findIndex((i: any) => i.address == item.address);
    if (index == -1) {
      data.push( item );
    }
    setItem('suggestions', [...data]);
  }

  return (
    <View style={styles.container}>

      {_renderPicker()}

      {predictions.length > 0 && (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            marginTop: 10,
            borderRadius: 5,
          }}>
          {predictions.map((item: any, index) => (
            <TouchableOpacity
              style={styles.predictView}
              onPress={() => selectPrediction(item)}>
              <Typography textType="light">{item.description}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {suggestions.length > 0 && (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            marginTop: 10,
            borderRadius: 5,
          }}>
          {suggestions.map((item: any, index) => (
            <TouchableOpacity
              style={{
                ...styles.predictView,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
              onPress={() => selectSuggestion(item) }>
              <Typography textType="light" style={{ flex: 1 }}>{item.address}</Typography>

              <TouchableOpacity onPress={() => removeSuggestion(item)}>
                <Typography>Remove</Typography>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    width: '90%',
    alignSelf: 'center',
    zIndex: 99,
  },
  predictView: {
    // marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...commonStyles.boxShadow,
    flexDirection: 'row',
  },
  inputField: {
    flex: 1,
    padding: Platform.OS == 'ios' ? 10 : 5,
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.text
  },
  fieldLine: {
    width: '100%',
    borderWidth: 0.7,
    borderColor: COLORS.border,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  origin: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  dropOff: {
    height: 10,
    width: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  verticalBar: {
    borderWidth: 1,
    height: '60%',
    position: 'absolute',
    alignSelf: 'center',
    borderColor: COLORS.lightGray,
  },
});
