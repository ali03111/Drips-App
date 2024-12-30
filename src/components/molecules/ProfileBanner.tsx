import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import FaIcon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTSIZE, IMAGES } from "../../constants";
import { userUpdate } from "../../store/actions/UserActions";
import { selectUser } from "../../store/selectors/userSelector";
import { formatUserType, renderStars } from "../../utils/utils";
import { Typography } from "../atoms";

export const ProfileBanner = (props: any) => {
  const { showToggle = true, showRating = false } = props;

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const onToggleChange = () => {
    dispatch(userUpdate({ is_online: user.is_online ? 0 : 1 }));
  };

  return (
    <ImageBackground source={IMAGES.profileBg} resizeMode={"cover"}>
      <View style={[
        styles.headerCard,
        { justifyContent: user.user_type != 'customer' ? 'flex-start': 'center' }
      ]}>
        { user.user_type != 'customer' && showToggle && (
          <ToggleBtn online={user.is_online} onPress={onToggleChange} />
        )}
        <Image
          source={ user.profile_image ? { uri: user.profile_image_url } : IMAGES.placeholderSm }
          style={{
            width: 80,
            height: 80,
            marginBottom: 5,
            borderRadius: 100,
          }}
          // defaultSource={IMAGES.placeholderSm}
        />
        <Typography size={FONTSIZE.L} textType={"semiBold"}>
          {user.name}
        </Typography>
        {showRating ? (
          <View style={{ flexDirection: "row" }}>
            {renderStars(user.avg_rating, 15)}
          </View>
        ) : (
          <Typography
            color={COLORS.secondary}
            size={FONTSIZE.XS}
            textType={"light"}
            style={{ textTransform: "capitalize" }}
          >
            { formatUserType(user.user_type) }
          </Typography>
        )}
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          height: 50,
          width: "100%",
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
          position: "absolute",
          bottom: -30,
        }}
      />
    </ImageBackground>
  );
};

const ToggleBtn = ({ online = 0, onPress }: any) => {
  return (
    <TouchableOpacity
      style={styles.asapToggle}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Typography>{online ? "Online" : "Offline"}</Typography>
      <FaIcon
        name="toggle-on"
        size={30}
        color={online ? COLORS.secondary : "#707070"}
        style={{
          marginLeft: 10,
          transform: [{ rotate: online ? "0deg" : "180deg" }],
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  asapToggle: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerCard: {
    height: 280,
    paddingTop: 30,
    alignItems: "center",
  },
});
