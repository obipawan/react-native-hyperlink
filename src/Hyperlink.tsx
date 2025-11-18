import React, { Component } from 'react';
import { View, Text, Linking, Platform, type TextProps } from 'react-native';
import { parse, format } from 'mdurl';
import type {
	HyperlinkProps,
	HyperlinkState,
	ReactElementWithType,
} from './types';

const linkify = require('linkify-it')();

const { OS } = Platform;

class Hyperlink extends Component<HyperlinkProps, HyperlinkState> {
	public static defaultProps: Partial<HyperlinkProps> = {
		linkify,
		injectViewProps: _ => ({}),
	};

	public static getDerivedStateFromProps(
		nextProps: HyperlinkProps,
		prevState: HyperlinkState,
	): HyperlinkState | null {
		return nextProps.linkify !== prevState.linkifyIt
			? { linkifyIt: nextProps.linkify || linkify }
			: null;
	}

	constructor(props: HyperlinkProps) {
		super(props);
		this.state = { linkifyIt: props.linkify || linkify };
	}

	render() {
		// Avoid spreading React special props such as `key` or `ref`
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { key: _key, ref: _ref, ...viewProps } = this.props as any;

		// If no link handlers or styles, just render children as-is
		if (
			!this.props.onPress &&
			!this.props.onLongPress &&
			!this.props.linkStyle
		) {
			return (
				<View
					{...viewProps}
					style={this.props.style}
				>
					{this.props.children}
				</View>
			);
		}

		// Otherwise, parse and linkify the children
		const wrapperElement = (
			<View
				{...viewProps}
				style={this.props.style}
			>
				{this.props.children}
			</View>
		) as ReactElementWithType;

		return (
			<View
				{...viewProps}
				style={this.props.style}
			>
				{this.parse(wrapperElement).props.children}
			</View>
		);
	}

	isTextNested(component: ReactElementWithType) {
		if (!React.isValidElement(component)) throw new Error('Invalid component');
		let { type: { displayName } = {} } = component;
		if (displayName !== 'Text') throw new Error('Not a Text component');
		return typeof component.props.children !== 'string';
	}

	linkify = (component: ReactElementWithType): ReactElementWithType => {
		// Type guard: ensure children is a string
		if (typeof component.props.children !== 'string') {
			return component;
		}

		const childrenString = component.props.children;

		if (
			!this.state.linkifyIt.pretest(childrenString) ||
			!this.state.linkifyIt.test(childrenString)
		)
			return component;

		let elements: Array<string | React.ReactElement> = [];
		let _lastIndex = 0;

		// Create component props (ref and key are React-specific and not in TextProps)
		const componentProps = component.props as TextProps;
		delete (componentProps as { ref?: unknown }).ref;
		delete (componentProps as { key?: unknown }).key;

		try {
			this.state.linkifyIt
				.match(childrenString)
				?.forEach(({ index, lastIndex, text, url }) => {
					let nonLinkedText = childrenString.substring(_lastIndex, index);
					nonLinkedText && elements.push(nonLinkedText);
					_lastIndex = lastIndex;
					if (this.props.linkText)
						text =
							typeof this.props.linkText === 'function'
								? this.props.linkText(url)
								: this.props.linkText;

					// Create handlers that match Text component's event handler signature
					const clickHandlerProps: {
						onPress?: (event: any) => void;
						onLongPress?: (event: any) => void;
					} = {};
					if (OS !== 'web') {
						clickHandlerProps.onLongPress = this.props.onLongPress
							? () => this.props.onLongPress?.(url, text)
							: undefined;
					}
					clickHandlerProps.onPress = this.props.onPress
						? () => this.props.onPress?.(url, text)
						: undefined;

					// Only spread safe Text props, excluding conflicting ones
					// We'll override children, onPress, onLongPress, and style below
					const safeProps = { ...componentProps };
					delete (safeProps as { children?: unknown }).children;
					delete (safeProps as { onPress?: unknown }).onPress;
					delete (safeProps as { onLongPress?: unknown }).onLongPress;
					delete (safeProps as { style?: unknown }).style;

					elements.push(
						<Text
							{...safeProps}
							{...clickHandlerProps}
							key={url + index}
							style={[component.props.style, this.props.linkStyle]}
							{...this.props.injectViewProps?.(url)}
						>
							{text}
						</Text>,
					);
				});
			elements.push(
				childrenString.substring(_lastIndex, childrenString.length),
			);
			return React.cloneElement(component, componentProps, elements);
		} catch (err) {
			return component;
		}
	};

	parse = (component: ReactElementWithType): ReactElementWithType => {
		let { props: { children } = { children: undefined } } = component || {};
		if (!children) return component;

		const componentProps = component.props as TextProps;
		delete (componentProps as { ref?: unknown }).ref;
		delete (componentProps as { key?: unknown }).key;

		return React.cloneElement(
			component,
			componentProps,
			React.Children.map(children, child => {
				// Handle string children
				if (typeof child === 'string' && this.state.linkifyIt.pretest(child)) {
					// Create a new Text element with only the style prop from parent
					return this.linkify(
						(
							<Text style={component.props.style}>{child}</Text>
						) as ReactElementWithType,
					);
				}

				// Handle React elements
				if (React.isValidElement(child)) {
					let { type: { displayName } = { displayName: undefined } } =
						child as ReactElementWithType;
					if (
						displayName === 'Text' &&
						!this.isTextNested(child as ReactElementWithType)
					) {
						return this.linkify(child as ReactElementWithType);
					}
					return this.parse(child as ReactElementWithType);
				}

				return child;
			}),
		);
	};
}

export default class extends Component<HyperlinkProps> {
	constructor(props: HyperlinkProps) {
		super(props);
		this.handleLink = this.handleLink.bind(this);
	}

	handleLink(url: string) {
		const urlObject = parse(url);
		urlObject.protocol = urlObject.protocol.toLowerCase();
		const normalizedURL = format(urlObject);

		Linking.canOpenURL(normalizedURL).then((supported: boolean) => {
			supported && Linking.openURL(normalizedURL);
		});
	}

	render() {
		const onPress = this.props.onPress ?? this.handleLink;
		// Do not forward `key`/`ref` to the inner `Hyperlink` to avoid
		// React warning about spreading a props object that contains `key`.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { key: _key, ref: _ref, ...rest } = this.props as any;
		return this.props.linkDefault ? (
			<Hyperlink
				{...rest}
				onPress={onPress}
			/>
		) : (
			<Hyperlink {...rest} />
		);
	}
}
