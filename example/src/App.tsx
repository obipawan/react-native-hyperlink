/* eslint-disable react-native/no-inline-styles */
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Hyperlink from 'react-native-hyperlink';

const examples = [
	// Example 1: Basic usage with linkDefault (opens URLs automatically)
	<Hyperlink linkDefault>
		<Text style={{ fontSize: 15 }}>
			Basic usage: This text will be parsed to check for clickable strings like
			https://github.com/obipawan/hyperlink and made clickable.
		</Text>
	</Hyperlink>,

	// Example 2: Custom onPress handler
	<Hyperlink
		onPress={(url, text) => console.log('Link Pressed:', { url, text })}
	>
		<Text style={{ fontSize: 15 }}>
			Custom handler: Click https://github.com/obipawan/hyperlink to see console
			log.
		</Text>
	</Hyperlink>,

	// Example 3: onLongPress handler
	<Hyperlink onLongPress={(url, _text) => console.log('Long Press:', url)}>
		<Text style={{ fontSize: 15 }}>
			Long press: Long press https://github.com/obipawan/hyperlink for long
			press handler.
		</Text>
	</Hyperlink>,

	// Example 4: Email addresses
	<Hyperlink
		linkDefault
		linkStyle={{ color: '#e74c3c', textDecorationLine: 'underline' }}
	>
		<Text style={{ fontSize: 15 }}>
			Email support: Contact us at test@example.com or support@company.com for
			help.
		</Text>
	</Hyperlink>,

	// Example 5: HTTP URLs (not just HTTPS)
	<Hyperlink linkDefault>
		<Text style={{ fontSize: 15 }}>
			HTTP URLs: Visit http://example.com or https://secure.example.com
		</Text>
	</Hyperlink>,

	// Example 6: Multiple links in one text
	<Hyperlink
		linkDefault
		linkStyle={{ color: '#2980b9', fontWeight: 'bold' }}
	>
		<Text style={{ fontSize: 15 }}>
			Multiple links: Check out https://reactnative.dev and
			https://github.com/obipawan/hyperlink for more info.
		</Text>
	</Hyperlink>,

	// Example 7: Nested Text components
	<Hyperlink onPress={(url, _text) => console.log('Clicked:', url)}>
		<View>
			<Text style={{ fontSize: 15 }}>
				Nested Text: A nested Text component
				https://facebook.github.io/react-native/docs/text.html works equally
				well <Text>with https://github.com/obipawan/hyperlink</Text>
			</Text>
		</View>
	</Hyperlink>,

	// Example 8: Custom linkStyle
	<Hyperlink
		linkStyle={{ color: '#2980b9', fontSize: 20, fontWeight: 'bold' }}
		linkDefault
	>
		<Text style={{ fontSize: 15 }}>
			Custom styling: Make clickable strings like
			https://github.com/obipawan/hyperlink stylable with custom colors and
			fonts.
		</Text>
	</Hyperlink>,

	// Example 9: linkText as function (transform URL text)
	<Hyperlink
		linkStyle={{ color: '#2980b9', fontSize: 20 }}
		linkText={url =>
			url === 'https://github.com/obipawan/hyperlink' ? 'Hyperlink' : url
		}
		linkDefault
	>
		<Text style={{ fontSize: 15 }}>
			Custom link text: Make clickable strings cleaner with
			https://github.com/obipawan/hyperlink (shows as "Hyperlink")
		</Text>
	</Hyperlink>,

	// Example 10: linkText as string (replace all links with same text)
	<Hyperlink
		linkStyle={{ color: '#27ae60' }}
		linkText='[Click here]'
		onPress={url => console.log('Opening:', url)}
	>
		<Text style={{ fontSize: 15 }}>
			linkText as string: All links like https://example.com and
			https://github.com will show as &quot;[Click here]&quot;
		</Text>
	</Hyperlink>,

	// Example 11: Combining features without linkDefault
	<Hyperlink
		linkStyle={{ color: '#9b59b6', fontWeight: 'bold' }}
		onPress={url => console.log('Custom Handler:', url)}
	>
		<Text style={{ fontSize: 15 }}>
			Custom handler + styling: https://github.com/obipawan/hyperlink with
			custom style and handler (no linkDefault)
		</Text>
	</Hyperlink>,

	// Example 12: injectViewProps (pass props based on URL)
	<Hyperlink
		linkDefault
		injectViewProps={url => ({
			testID: url === 'https://link.com' ? 'red-link' : 'blue-link',
			style:
				url === 'https://link.com'
					? { color: 'red', fontWeight: 'bold' }
					: { color: 'blue' },
		})}
	>
		<Text>
			Dynamic props: You can pass props to clickable components matched by URL.
			<Text>This URL looks red https://link.com</Text> and this URL looks blue
			https://link2.com
		</Text>
	</Hyperlink>,

	// Example 13: Links at different positions
	<Hyperlink
		linkDefault
		linkStyle={{ color: '#e67e22' }}
	>
		<Text style={{ fontSize: 15 }}>
			https://start.com link at start, link in middle https://middle.com, and
			link at end https://end.com
		</Text>
	</Hyperlink>,

	// Example 14: Text without links (should render as-is)
	<Hyperlink linkStyle={{ color: '#3498db' }}>
		<Text style={{ fontSize: 15 }}>
			No links here: This text has no URLs or emails, so it renders normally.
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
				ItemSeparatorComponent={Separator}
			/>
		</View>
	);
}

const Separator = () => (
	<View style={{ margin: 10, borderWidth: 0.5, borderColor: 'black' }} />
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 100,
	},
});
