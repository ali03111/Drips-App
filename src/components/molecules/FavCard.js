import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';

import { COLORS, FONTSIZE, IMAGES } from '../../constants';
import { navigate } from '../../navigation/RootNavigation';
import { Typography } from '../atoms';
import { HeartIcon } from '../icons';

export const FavCard = (props) => {
	const {
		heartIcon = true,
		leftBottom,
		style = {}
	} = props;

	const [fav, setFav] = useState(false);
	const statusFavIcon = () => {
		return (
			heartIcon && (
				<TouchableOpacity
					onPress={() => setFav(!fav)}
					style={{
						backgroundColor: fav ? 'transparent' : 'red',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 30 / 2,
						width: 30,
						height: 30,
						borderWidth: 0.7,
						borderColor: '#fff',
					}}>
					<HeartIcon width={15} height={15} fill={'white'} />
				</TouchableOpacity>
			)
		)
	}
	return (
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={() => navigate('ProductDetail')}
			style={{
				width: '48%',
				height: 220,
				marginBottom: 20,
				...style
			}}>
			<ImageBackground source={IMAGES.MainCard} style={styles.serviceImg} resizeMode='stretch'>
				<View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
					{statusFavIcon()}
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Image source={IMAGES.GunImg1} style={{ width: 120, height: 120 }} resizeMode='contain' />
					<Typography color='#fff' numberOfLines={1} size={FONTSIZE.XS} style={{ alignSelf: 'flex-start' }}>
						BARR 19246 MK22
					</Typography>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
					<Typography color='#fff' numberOfLines={1} size={FONTSIZE.S} style={{}}>
						$12,010
					</Typography>
					<Typography style={{ textDecorationLine: 'line-through' }} color={COLORS.primary}>{leftBottom}</Typography>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	serviceImg: {
		flex: 1,
		padding: 15,
	},
});
