import React from "react";
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Platform } from "react-native";
import { COLORS, FONTSIZE } from "../../constants";
import { commonStyles } from "../../style";
import { Typography } from "./Typography";

type Props = {
  visibility: Boolean;
  title: String;
  options: Array<{}>;
  onSelect: () => {};
}

const SelectListModal = (props: Props) => {

  const {
    visibility,
    title,
    options = [],
    onSelect = () => {},
    onCancel = () => {}
  }: any = props;

  return (
    <Modal
        animationType='slide'
        transparent={true}
        visible={visibility}
      >
          <View style={styles.modalView}>
            <View style={ styles.header }>
              <Typography textType="semiBold" size={ FONTSIZE.L } align={'center'} style={{ margin: 20 }}>
                { title }
              </Typography>
            </View>

            <FlatList 
              style={{ flex: 1, marginTop: 10 }}
              data={options}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return ( <TouchableOpacity
                  style={{ 
                    width: '45%', 
                    alignItems: 'center',
                    borderWidth: 0.5,
                    borderColor: COLORS.secondary,
                    margin: 10,
                    padding: 10,
                    borderRadius: 5
                  }}
                  onPress={() => onSelect( item )}
                  key={index}
                >
                  <Typography>{ item }</Typography>
                </TouchableOpacity>)
              }}
              ListEmptyComponent={() => {
                return (
                  <TouchableOpacity onPress={ () => onCancel() } style={{ alignItems: 'center', height: 300, justifyContent: 'center' }}>
                    <Typography>Slot Not Available</Typography>
                  </TouchableOpacity>
                )
              }}
            />
          </View>

      </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 4
  },
  modalView: {
    marginTop: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    height: '100%'
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: COLORS.secondary,
    padding: 5,
    borderRadius: 20
  }
});

export default SelectListModal;
