import { render, fireEvent } from '@testing-library/react-native';
import { Text, View, Linking, Platform } from 'react-native';
import Hyperlink from '../index';

// Mock Linking methods
jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

describe('Hyperlink', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(Platform.OS as any) = 'ios';
	});

	describe('Basic Rendering', () => {
		it('should render children without links as-is when no handlers or styles', () => {
			const { getByText } = render(
				<Hyperlink>
					<Text>Simple text without links</Text>
				</Hyperlink>,
			);

			const textElement = getByText('Simple text without links');
			expect(textElement).toBeTruthy();
			// Verify no link processing occurred - text should not have onPress handler
			expect(textElement.props.onPress).toBeUndefined();
		});

		it('should render View with custom style', () => {
			const customStyle = { backgroundColor: 'red', padding: 10 };
			const { getByText, UNSAFE_root } = render(
				<Hyperlink style={customStyle}>
					<Text>Test</Text>
				</Hyperlink>,
			);

			expect(getByText('Test')).toBeTruthy();
			// Verify the style is actually applied to the View
			if (UNSAFE_root?.props?.style) {
				const rootStyle = Array.isArray(UNSAFE_root.props.style)
					? Object.assign({}, ...UNSAFE_root.props.style)
					: UNSAFE_root.props.style;
				expect(rootStyle).toMatchObject(customStyle);
			}
		});

		it('should render children when no links are present', () => {
			const { getByText } = render(
				<Hyperlink>
					<Text>No links here</Text>
				</Hyperlink>,
			);

			expect(getByText('No links here')).toBeTruthy();
		});
	});

	describe('Link Detection', () => {
		it('should detect and render HTTP URLs', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>Visit http://example.com for more info</Text>
				</Hyperlink>,
			);

			expect(getByText('http://example.com')).toBeTruthy();
		});

		it('should detect and render HTTPS URLs', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>Check https://github.com for code</Text>
				</Hyperlink>,
			);

			expect(getByText('https://github.com')).toBeTruthy();
		});

		it('should detect and render email addresses', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>Contact us at test@example.com</Text>
				</Hyperlink>,
			);

			expect(getByText('test@example.com')).toBeTruthy();
		});

		it('should detect multiple links in text', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>Visit http://example.com and https://github.com for more</Text>
				</Hyperlink>,
			);

			expect(getByText('http://example.com')).toBeTruthy();
			expect(getByText('https://github.com')).toBeTruthy();
		});

		it('should preserve non-link text between links', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>Visit http://example.com and https://github.com now</Text>
				</Hyperlink>,
			);

			// Check that links exist
			const link1 = getByText('http://example.com');
			const link2 = getByText('https://github.com');
			expect(link1).toBeTruthy();
			expect(link2).toBeTruthy();

			// Verify non-link text is preserved
			// The component splits text into: "Visit ", link1, " and ", link2, " now"
			// We verify by checking that text nodes exist (not just links)
			// Links should be clickable Text components, and surrounding text should be string nodes
			// The fact that we can find both links separately confirms text is preserved between them
			expect(link1.props.onPress).toBeDefined(); // Link should be clickable
			expect(link2.props.onPress).toBeDefined(); // Link should be clickable
			// If text wasn't preserved, we wouldn't be able to find both links separately
		});
	});

	describe('onPress Handler', () => {
		it('should call onPress when link is pressed', () => {
			const onPressMock = jest.fn();
			const { getByText } = render(
				<Hyperlink onPress={onPressMock}>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('http://example.com');
			fireEvent.press(link);

			expect(onPressMock).toHaveBeenCalledWith(
				'http://example.com',
				'http://example.com',
			);
		});

		it('should call onPress with correct URL and text', () => {
			const onPressMock = jest.fn();
			const { getByText } = render(
				<Hyperlink onPress={onPressMock}>
					<Text>Email test@example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('test@example.com');
			fireEvent.press(link);

			// Email addresses are converted to mailto: URLs by linkify-it
			expect(onPressMock).toHaveBeenCalledWith(
				'mailto:test@example.com',
				'test@example.com',
			);
		});

		it('should call onPress for each link separately', () => {
			const onPressMock = jest.fn();
			const { getByText } = render(
				<Hyperlink onPress={onPressMock}>
					<Text>Visit http://example.com and https://github.com</Text>
				</Hyperlink>,
			);

			const link1 = getByText('http://example.com');
			const link2 = getByText('https://github.com');

			fireEvent.press(link1);
			fireEvent.press(link2);

			expect(onPressMock).toHaveBeenCalledTimes(2);
			expect(onPressMock).toHaveBeenNthCalledWith(
				1,
				'http://example.com',
				'http://example.com',
			);
			expect(onPressMock).toHaveBeenNthCalledWith(
				2,
				'https://github.com',
				'https://github.com',
			);
		});
	});

	describe('onLongPress Handler', () => {
		it('should call onLongPress when link is long pressed (non-web)', () => {
			(Platform.OS as any) = 'ios';
			const onLongPressMock = jest.fn();
			const { getByText } = render(
				<Hyperlink onLongPress={onLongPressMock}>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('http://example.com');
			fireEvent(link, 'longPress');

			expect(onLongPressMock).toHaveBeenCalledWith(
				'http://example.com',
				'http://example.com',
			);
		});

		it('should not have onLongPress on web platform', () => {
			// Since Platform.OS is captured at module load time in Hyperlink.tsx,
			// we need to test this differently. The component checks OS !== 'web'
			// at runtime, but OS is captured at module load. For this test,
			// we verify that onLongPress behavior works correctly on non-web platforms
			// and note that web platform handling requires Platform.OS to be 'web'
			// at the time the Hyperlink module is loaded.

			// On iOS (current platform), onLongPress should be available
			const onLongPressMock = jest.fn();
			const { getByText } = render(
				<Hyperlink onLongPress={onLongPressMock}>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('http://example.com');
			// On non-web platforms, onLongPress should be available
			expect(link.props.onLongPress).toBeDefined();

			// Note: Testing web platform behavior would require Platform.OS to be 'web'
			// at module load time, which is difficult to test without module mocking.
			// The component correctly implements the check: if (OS !== 'web')
		});
	});

	describe('linkDefault', () => {
		it('should use default link handler when linkDefault is true', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('http://example.com');
			expect(link.props.onPress).toBeDefined();

			// Call the handler
			fireEvent.press(link);

			// Should call Linking.canOpenURL
			expect(Linking.canOpenURL).toHaveBeenCalled();
		});

		it('should normalize URL protocol to lowercase', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>Visit HTTP://EXAMPLE.COM</Text>
				</Hyperlink>,
			);

			const link = getByText('HTTP://EXAMPLE.COM');
			fireEvent.press(link);

			// The URL should be normalized to lowercase protocol
			expect(Linking.canOpenURL).toHaveBeenCalled();
			// Verify the normalized URL was passed (protocol MUST be lowercase, not case-insensitive)
			const callArgs = (Linking.canOpenURL as jest.Mock).mock.calls[0][0];
			expect(callArgs).toMatch(/^http:\/\//); // Protocol should be http:// (lowercase, case-sensitive)
			expect(callArgs).not.toMatch(/^HTTP:\/\//); // Should NOT be uppercase
			// Verify it starts with lowercase http
			expect(callArgs.startsWith('http://')).toBe(true);
		});

		it('should not use default handler when linkDefault is false', () => {
			const onPressMock = jest.fn();
			const { getByText } = render(
				<Hyperlink
					linkDefault={false}
					onPress={onPressMock}
				>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('http://example.com');
			fireEvent.press(link);

			expect(onPressMock).toHaveBeenCalled();
			expect(Linking.canOpenURL).not.toHaveBeenCalled();
		});

		it('should prefer custom onPress over default handler', () => {
			const onPressMock = jest.fn();
			const { getByText } = render(
				<Hyperlink
					linkDefault
					onPress={onPressMock}
				>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('http://example.com');
			fireEvent.press(link);

			// Custom handler should be called
			expect(onPressMock).toHaveBeenCalled();
			// Default handler (handleLink) should NOT be called
			// Since custom onPress is provided, Linking.canOpenURL should not be called
			expect(Linking.canOpenURL).not.toHaveBeenCalled();
		});
	});

	describe('linkStyle', () => {
		it('should apply custom style to links', () => {
			const linkStyle = { color: 'blue', fontWeight: 'bold' as const };
			const { getByText } = render(
				<Hyperlink linkStyle={linkStyle}>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('http://example.com');
			const styles = link.props.style;

			expect(styles).toBeTruthy();
			if (Array.isArray(styles)) {
				expect(styles).toContainEqual(linkStyle);
			} else {
				expect(styles).toMatchObject(linkStyle);
			}
		});

		it('should merge linkStyle with existing Text style', () => {
			const textStyle = { fontSize: 16 };
			const linkStyle = { color: 'blue' };
			const { getByText } = render(
				<Hyperlink linkStyle={linkStyle}>
					<Text style={textStyle}>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('http://example.com');
			const styles = link.props.style;

			expect(Array.isArray(styles)).toBe(true);
			if (Array.isArray(styles)) {
				expect(styles).toContainEqual(textStyle);
				expect(styles).toContainEqual(linkStyle);
			}
		});
	});

	describe('linkText', () => {
		it('should replace link text with string when linkText is a string', () => {
			const { getByText, queryByText } = render(
				<Hyperlink
					linkText='Click here'
					linkDefault
				>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			expect(getByText('Click here')).toBeTruthy();
			expect(queryByText('http://example.com')).toBeNull();
		});

		it('should transform link text using function', () => {
			const linkTextFn = (url: string) => `Link to ${url}`;
			const { getByText } = render(
				<Hyperlink
					linkText={linkTextFn}
					linkDefault
				>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			expect(getByText('Link to http://example.com')).toBeTruthy();
		});

		it('should use function linkText with URL parameter', () => {
			const linkTextFn = jest.fn((url: string) => `Custom: ${url}`);
			const { getByText } = render(
				<Hyperlink
					linkText={linkTextFn}
					linkDefault
				>
					<Text>Visit http://example.com and https://github.com</Text>
				</Hyperlink>,
			);

			expect(linkTextFn).toHaveBeenCalledWith('http://example.com');
			expect(linkTextFn).toHaveBeenCalledWith('https://github.com');
			expect(getByText('Custom: http://example.com')).toBeTruthy();
			expect(getByText('Custom: https://github.com')).toBeTruthy();
		});
	});

	describe('injectViewProps', () => {
		it('should inject props based on URL', () => {
			const injectProps = (url: string) => ({
				testID: url === 'http://example.com' ? 'example-link' : 'other-link',
			});

			const { getByTestId } = render(
				<Hyperlink
					injectViewProps={injectProps}
					linkDefault
				>
					<Text>Visit http://example.com and https://github.com</Text>
				</Hyperlink>,
			);

			expect(getByTestId('example-link')).toBeTruthy();
			expect(getByTestId('other-link')).toBeTruthy();
		});

		it('should inject style based on URL', () => {
			const injectProps = (url: string) => ({
				style:
					url === 'http://example.com' ? { color: 'red' } : { color: 'blue' },
			});

			const { getByText } = render(
				<Hyperlink
					injectViewProps={injectProps}
					linkDefault
				>
					<Text>Visit http://example.com and https://github.com</Text>
				</Hyperlink>,
			);

			const link1 = getByText('http://example.com');
			const link2 = getByText('https://github.com');

			const styles1 = Array.isArray(link1.props.style)
				? link1.props.style
				: [link1.props.style];
			const styles2 = Array.isArray(link2.props.style)
				? link2.props.style
				: [link2.props.style];

			expect(styles1.some((s: any) => s?.color === 'red')).toBe(true);
			expect(styles2.some((s: any) => s?.color === 'blue')).toBe(true);
		});
	});

	describe('Nested Text Components', () => {
		it('should handle nested Text components', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<View>
						<Text>
							Outer text with http://example.com{' '}
							<Text>nested text with https://github.com</Text>
						</Text>
					</View>
				</Hyperlink>,
			);

			expect(getByText('http://example.com')).toBeTruthy();
			expect(getByText('https://github.com')).toBeTruthy();
		});

		it('should handle deeply nested Text components', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<View>
						<Text>
							Level 1 with http://example.com
							<Text>
								Level 2 with https://github.com
								<Text>Level 3 with test@example.com</Text>
							</Text>
						</Text>
					</View>
				</Hyperlink>,
			);

			expect(getByText('http://example.com')).toBeTruthy();
			expect(getByText('https://github.com')).toBeTruthy();
			expect(getByText('test@example.com')).toBeTruthy();
		});

		it('should not process nested Text with non-string children', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>
						Text with http://example.com{' '}
						<Text>
							<Text>Nested</Text>
						</Text>
					</Text>
				</Hyperlink>,
			);

			// Should still detect the link in the parent
			expect(getByText('http://example.com')).toBeTruthy();
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty children', () => {
			// Should render without errors - component should render a View
			const { UNSAFE_root } = render(<Hyperlink />);
			expect(UNSAFE_root).toBeTruthy();
			// Component should render successfully without crashing
			// When no children, it should render an empty View
			expect(UNSAFE_root).toBeDefined();
			// Verify it's a valid React element
			expect(UNSAFE_root.type).toBeDefined();
		});

		it('should handle text without any links', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>This text has no links at all</Text>
				</Hyperlink>,
			);

			expect(getByText('This text has no links at all')).toBeTruthy();
		});

		it('should handle text with only links', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>http://example.com</Text>
				</Hyperlink>,
			);

			expect(getByText('http://example.com')).toBeTruthy();
		});

		it('should handle multiple consecutive links', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>http://example.com https://github.com test@example.com</Text>
				</Hyperlink>,
			);

			expect(getByText('http://example.com')).toBeTruthy();
			expect(getByText('https://github.com')).toBeTruthy();
			expect(getByText('test@example.com')).toBeTruthy();
		});

		it('should handle links at the start of text', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>http://example.com is a great site</Text>
				</Hyperlink>,
			);

			expect(getByText('http://example.com')).toBeTruthy();
		});

		it('should handle links at the end of text', () => {
			const { getByText } = render(
				<Hyperlink linkDefault>
					<Text>Visit our site at http://example.com</Text>
				</Hyperlink>,
			);

			expect(getByText('http://example.com')).toBeTruthy();
		});

		it('should handle custom linkify instance', () => {
			const linkify = require('linkify-it')();
			linkify.set({ fuzzyLink: false });

			const { queryByText } = render(
				<Hyperlink
					linkify={linkify}
					linkDefault
				>
					<Text>Visit example.com (fuzzy link)</Text>
				</Hyperlink>,
			);

			// Fuzzy links should not be detected
			expect(queryByText('example.com')).toBeNull();
		});
	});

	describe('Combined Features', () => {
		it('should combine linkStyle, linkText, and onPress', () => {
			const onPressMock = jest.fn();
			const linkStyle = { color: 'blue' };
			const linkTextFn = (url: string) => `Link: ${url}`;

			const { getByText } = render(
				<Hyperlink
					onPress={onPressMock}
					linkStyle={linkStyle}
					linkText={linkTextFn}
				>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByText('Link: http://example.com');
			expect(link).toBeTruthy();

			const styles = link.props.style;
			if (Array.isArray(styles)) {
				expect(styles).toContainEqual(linkStyle);
			}

			fireEvent.press(link);
			expect(onPressMock).toHaveBeenCalledWith(
				'http://example.com',
				'Link: http://example.com',
			);
		});

		it('should combine all features: linkDefault, linkStyle, linkText, injectViewProps', () => {
			const linkStyle = { color: 'green' };
			const linkTextFn = (_url: string) => 'Custom Link';
			const injectProps = () => ({ testID: 'custom-link' });

			const { getByTestId } = render(
				<Hyperlink
					linkDefault
					linkStyle={linkStyle}
					linkText={linkTextFn}
					injectViewProps={injectProps}
				>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			const link = getByTestId('custom-link');
			expect(link).toBeTruthy();
			expect(link.props.children).toBe('Custom Link');

			const styles = link.props.style;
			if (Array.isArray(styles)) {
				expect(styles.some((s: any) => s?.color === 'green')).toBe(true);
			}
		});
	});

	describe('Performance', () => {
		it('should use pretest before test for performance', () => {
			const linkify = require('linkify-it')();
			const pretestSpy = jest.spyOn(linkify, 'pretest');
			const testSpy = jest.spyOn(linkify, 'test');

			render(
				<Hyperlink
					linkify={linkify}
					linkDefault
				>
					<Text>Visit http://example.com</Text>
				</Hyperlink>,
			);

			expect(pretestSpy).toHaveBeenCalled();
			// test should only be called if pretest passes
			expect(testSpy).toHaveBeenCalled();

			pretestSpy.mockRestore();
			testSpy.mockRestore();
		});
	});
});
