import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { COLORS, IMAGES, } from "../../constants";
import StarRating from "react-native-star-rating";
import { Button, Typography } from "../../components/atoms";
import { commonStyles } from "../../style";
import { SelectableComponent } from "./SelectableComponent";

type Props = {
  visible: Boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const Review = (props: Props) => {
  const { onSubmit, onClose, visible }: any = props;
  
  const [starCount, onStarRatingPress] = useState(3)
  const [tools, setTools] = useState([]);
  
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 30,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View style={styles.modalView}>
          <View style={styles.imgStyle}>
            <Image
              source={IMAGES.avatar}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </View>
          <Typography align="center" size={20} textType="heading" color="#000">RATE THE NANNY SERVICE</Typography>
          <View style={[commonStyles.justifyContentBetween, { marginVertical: 10 }]}>
            <Typography color={COLORS.black} textType={'light'}>Your Rating</Typography>
            <StarRating
              disabled={false}
              maxStars={5}
              starSize={20}
              fullStarColor={"#FFA200"}
              rating={starCount}
              starStyle={{ padding: 3 }}
              selectedStar={(rating) => onStarRatingPress(rating)}
            />
          </View>
          <SelectableComponent
            data={TOOLS}
            mode={"single"}
            selected={tools}
            setSelected={setTools}
          />
          <Button
            label={'Confirm Rating'}
            onPress={() => {
              onSubmit()
            }}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: COLORS.white,
  },
  imgStyle: {
    alignSelf: "center",
    borderWidth: 0.5,
    borderColor: COLORS.halfWhite,
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20

  }
});

export default Review;
export const TOOLS = [
  {
    id: 1,
    title: "On Time",
  },
  {
    id: 2,
    title: "Behavior",
  },
  {
    id: 3,
    title: "Safety",
  },
  {
    id: 4,
    title: "Driving",
  },
  {
    id: 5,
    title: "Satisfied",
  },
  {
    id: 6,
    title: "Others",
  },
];

