import React, { Component } from 'react';
import { View, Text, Linking, Platform } from 'react-native';
import mdurl from 'mdurl';
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
		const {
			onPress,
			linkDefault,
			onLongPress,
			linkStyle,
			linkify,
			linkText,
			...viewProps
		} = this.props;

		return (
			<View
				{...viewProps}
				style={this.props.style}
			>
				{!this.props.onPress && !this.props.onLongPress && !this.props.linkStyle
					? this.props.children
					: //@ts-ignore
					  this.parse(this).props.children}
			</View>
		);
	}

	isTextNested(component: ReactElementWithType) {
		if (!React.isValidElement(component)) throw new Error('Invalid component');
		let { type: { displayName } = {} } = component;
		if (displayName !== 'Text') throw new Error('Not a Text component');
		return typeof component.props.children !== 'string';
	}

	linkify = (component: ReactElementWithType) => {
		if (
			!this.state.linkifyIt.pretest(component.props.children) ||
			!this.state.linkifyIt.test(component.props.children)
		)
			return component;

		let elements = [];
		let _lastIndex = 0;

		const componentProps = {
			...component.props,
			ref: undefined,
			key: undefined,
		};

		try {
			this.state.linkifyIt
				.match(component.props.children)
				?.forEach(({ index, lastIndex, text, url }) => {
					let nonLinkedText = component.props.children.substring(
						_lastIndex,
						index,
					);
					nonLinkedText && elements.push(nonLinkedText);
					_lastIndex = lastIndex;
					if (this.props.linkText)
						text =
							typeof this.props.linkText === 'function'
								? this.props.linkText(url)
								: this.props.linkText;

					const clickHandlerProps: {
						onPress?: HyperlinkProps['onPress'];
						onLongPress?: HyperlinkProps['onLongPress'];
					} = {};
					if (OS !== 'web') {
						clickHandlerProps.onLongPress = this.props.onLongPress
							? () => this.props.onLongPress?.(url, text)
							: undefined;
					}
					clickHandlerProps.onPress = this.props.onPress
						? () => this.props.onPress?.(url, text)
						: undefined;

					elements.push(
						<Text
							{...componentProps}
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
				component.props.children.substring(
					_lastIndex,
					component.props.children.length,
				),
			);
			return React.cloneElement(component, componentProps, elements);
		} catch (err) {
			return component;
		}
	};

	parse = (component: ReactElementWithType): ReactElementWithType => {
		let { props: { children } = { children: undefined } } = component || {};
		if (!children) return component;

		const componentProps = {
			...component.props,
			ref: undefined,
			key: undefined,
		};

		return React.cloneElement(
			component,
			componentProps,
			React.Children.map(children, (child: ReactElementWithType) => {
				let { type: { displayName } = { displayName: undefined } } =
					child || {};
				if (typeof child === 'string' && this.state.linkifyIt.pretest(child))
					return this.linkify(
						<Text
							{...componentProps}
							style={component.props.style}
						>
							{child}
						</Text>,
					);
				if (displayName === 'Text' && !this.isTextNested(child))
					return this.linkify(child);
				return this.parse(child);
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
		const urlObject = mdurl.parse(url);
		urlObject.protocol = urlObject.protocol.toLowerCase();
		const normalizedURL = mdurl.format(urlObject);

		Linking.canOpenURL(normalizedURL).then(
			supported => supported && Linking.openURL(normalizedURL),
		);
	}

	render() {
		const onPress = this.handleLink || this.props.onPress;
		return this.props.linkDefault ? (
			<Hyperlink
				{...this.props}
				onPress={onPress}
			/>
		) : (
			<Hyperlink {...this.props} />
		);
	}
}
