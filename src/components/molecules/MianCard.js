import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';

import { COLORS, FONTSIZE, IMAGES } from '../../constants';
import { navigate } from '../../navigation/RootNavigation';
import { Typography } from '../atoms';
import { HeartIcon } from '../icons';

export const MainCard = (props) => {
	const {
		heartIcon = true,
		leftBottom,
		style = {}
	} = props;

	const [fav, setFav] = useState(false);
	const [discount, setDiscount] = useState('10% OFF');
	const [favIcon, setFavIcon] = useState(true);

	const rightSide = () => {
		if (discount != '') {
			return (
				<View
					style={{
						borderRadius: 5,
						paddingHorizontal: 5,
						paddingVertical: 0,
						backgroundColor: 'red',
					}}>
					<Typography color='#fff' size={FONTSIZE.XS}>
						10% OFF
					</Typography>
				</View>
			);
		}
	};
	// const statusFavIcon = () => {
	// if (favIcon == true) {
	// 	{
	// 		heartIcon && (
	// 			<TouchableOpacity
	// 				onPress={() => setFav(!fav)}
	// 				style={{
	// 					backgroundColor: fav ? 'red' : 'transparent',
	// 					justifyContent: 'center',
	// 					alignItems: 'center',
	// 					borderRadius: 30 / 2,
	// 					width: 30,
	// 					height: 30,
	// 					borderWidth: 0.7,
	// 					borderColor: '#fff',
	// 				}}>
	// 				<HeartIcon width={15} height={15} fill={'white'} />
	// 			</TouchableOpacity>
	// 		)
	// 	}
	// } else {
	// 	{
	// 		heartIcon && (
	// 			<TouchableOpacity
	// 				onPress={() => setFav(!fav)}
	// 				style={{
	// 					backgroundColor: fav ? 'transparent' : 'blue',
	// 					justifyContent: 'center',
	// 					alignItems: 'center',
	// 					borderRadius: 30 / 2,
	// 					width: 30,
	// 					height: 30,
	// 					borderWidth: 0.7,
	// 					borderColor: '#fff',
	// 				}}>
	// 				<HeartIcon width={15} height={15} fill={'white'} />
	// 			</TouchableOpacity>
	// 		)
	// 	}
	// }
	// }

	const statusFavIcon = () => {
		return (
			favIcon == favIcon ? heartIcon && (
				<TouchableOpacity
					onPress={() => setFav(!fav)}
					style={{
						backgroundColor: fav ? 'red' : 'transparent',
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
				:
				<Typography>abjkjk</Typography>
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
					{/* {heartIcon && (
						<TouchableOpacity
							onPress={() => setFav(!fav)}
							style={{
								backgroundColor: fav ? 'red' : 'transparent',
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
					)} */}


					{statusFavIcon()}
					{rightSide()}
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
