import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS, screenWidth } from "../../constants";
import { Typography } from "../atoms";
import { commonStyles } from "../../style";
import { updateStates } from "../../store/actions/AppActions";
import store from "../../store";

export const ServiceCard = ({ item, index, props }: any) => {
  return (
    <TouchableOpacity
      style={[styles.itemCard, commonStyles.boxShadow]}
      onPress={() => {
        store.dispatch(updateStates({ serviceId: item.id }));
        props.navigation.navigate("ScheduleBooking");
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: item.image_url }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
          }}
        />
        <View>
          <Typography
            style={{ width: screenWidth(60) }} 
            ellipsizeMode={'tail'}
            numberOfLines={1}
          >
            {item.service_name}
          </Typography>
          <Typography 
            textType="light" 
            color={COLORS.secondary} size={12}>
            {item.pricing_type}
          </Typography>
        </View>
      </View>

      <View style={{}}>
        <Typography color={COLORS.secondary}>
          £ {item.pivot?.price || item.price_per_hour}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
});
