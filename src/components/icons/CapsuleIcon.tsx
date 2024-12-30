import React from 'react';
import Svg, { Path, G, Rect, Circle } from 'react-native-svg';

export const CapsuleIcon = (props: any) => {

  const {
  } = props;

  return (
    <Svg
      width={21}
      height={21.003}
      viewBox="0 0 21 21.003"
    >
      <G fill="#fff">
        <Path
          data-name="Path 21991"
          d="M6.179 171.118l-4.527 4.527a5.54 5.54 0 007.835 7.835l4.527-4.527z"
          transform="translate(-.031) translate(0 -164.098)"
        />
        <Path
          data-name="Path 21992"
          d="M183.447 1.623a5.54 5.54 0 00-7.835 0l-4.527 4.527 7.835 7.835 4.527-4.527a5.546 5.546 0 000-7.835z"
          transform="translate(-.031) translate(-164.036)"
        />
      </G>
    </Svg>
  )
};