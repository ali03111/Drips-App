import React from 'react';
import Svg, {Path, G, Defs, LinearGradient, Stop, Rect} from 'react-native-svg';

export const CheckBox = (props: any) => {

  const {
    color = '#dc5de0',
    selected = false
  } = props;

  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
    >
      <Defs>
        <LinearGradient
          id="a"
          x1={0.973}
          x2={0}
          y2={1}
          gradientUnits="objectBoundingBox"
        >
          <Stop offset={0} stopColor="#3bb5f2" />
          <Stop offset={1} stopColor="#1b89bf" />
        </LinearGradient>
      </Defs>
      <G transform="translate(-335 -480)">
        <Rect
          data-name="Rectangle 5"
          width={20}
          height={20}
          rx={10}
          transform="translate(335 480)"
          fill="url(#a)"
        />
        
        { 
          selected ? 
          <Rect
            data-name="Rectangle 5"
            width={10}
            height={10}
            rx={5}
            transform="translate(340 485)"
            fill="#fff"
          /> :
          <Rect
            data-name="Rectangle 5"
            width={18}
            height={18}
            rx={9}
            transform="translate(336 481)"
            fill="#fff"
          /> 
        }
      </G>
    </Svg>
  )
};