import * as React from 'react';

import { FlatList, StyleSheet, Text, View } from 'react-native';
import Hyperlink from 'react-native-hyperlink';

const examples = [
	<Hyperlink linkDefault={true}>
		<Text style={{ fontSize: 15 }}>
			This text will be parsed to check for clickable strings like
			https://github.com/obipawan/hyperlink and made clickable.
		</Text>
	</Hyperlink>,
	//@ts-ignore
	<Hyperlink onPress={(url, text) => alert(url + ', ' + text)}>
		<Text style={{ fontSize: 15 }}>
			This text will be parsed to check for clickable strings like
			https://github.com/obipawan/hyperlink and made clickable.
		</Text>
	</Hyperlink>,
	//@ts-ignore
	<Hyperlink onLongPress={(url, text) => alert(url + ', ' + text)}>
		<Text style={{ fontSize: 15 }}>
			This text will be parsed to check for clickable strings like
			https://github.com/obipawan/hyperlink and made clickable for long click.
		</Text>
	</Hyperlink>,
	//@ts-ignore
	<Hyperlink onPress={(url, text) => alert(url + ', ' + text)}>
		<View>
			<Text style={{ fontSize: 15 }}>
				A nested Text component
				https://facebook.github.io/react-native/docs/text.html works equally
				well <Text>with https://github.com/obipawan/hyperlink</Text>
			</Text>
		</View>
	</Hyperlink>,
	<Hyperlink
		linkStyle={{ color: '#2980b9', fontSize: 20 }}
		linkDefault
	>
		<Text style={{ fontSize: 15 }}>
			Make clickable strings like https://github.com/obipawan/hyperlink stylable
		</Text>
	</Hyperlink>,
	<Hyperlink
		linkStyle={{ color: '#2980b9', fontSize: 20 }}
		linkText={url =>
			url === 'https://github.com/obipawan/hyperlink' ? 'Hyperlink' : url
		}
	>
		<Text style={{ fontSize: 15 }}>
			Make clickable strings cleaner with https://github.com/obipawan/hyperlink
		</Text>
	</Hyperlink>,
	<Hyperlink
		linkDefault
		injectViewProps={url => ({
			testID: url === 'http://link.com' ? 'id1' : 'id2',
			style: url === 'https://link.com' ? { color: 'red' } : { color: 'blue' },
			//any other props you wish to pass to the component
		})}
	>
		<Text>
			You can pass props to clickable components matched by url.
			<Text>This url looks red https://link.com</Text> and this url looks blue
			https://link2.com{' '}
		</Text>
	</Hyperlink>,
];

const renderItem = ({ index }: { index: number }) => examples[index] || <></>;
export default function App() {
	return (
		<View style={styles.container}>
			<FlatList
				data={examples}
				renderItem={renderItem}
				ItemSeparatorComponent={() => (
					<View
						style={{ margin: 10, borderWidth: 0.5, borderColor: 'black' }}
					/>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 100,
	},
	box: {
		width: 60,
		height: 60,
		marginVertical: 20,
	},
});
