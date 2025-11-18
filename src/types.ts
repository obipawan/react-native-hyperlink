import type LinkifyIt from 'linkify-it';
import type { ReactElement, ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';

// Type for Text component with string children (used in linkify method)
export type TextElementWithStringChildren = ReactElement<TextProps> & {
	type: { displayName?: string };
	props: TextProps & {
		children: string;
	};
};

// Type for general React elements we parse (can be Text or View)
export type ReactElementWithType = ReactElement<TextProps | ViewProps> & {
	type?: { displayName?: string };
	props: (TextProps | ViewProps) & {
		children?: ReactNode;
		style?: TextProps['style'] | ViewProps['style'];
		[key: string]: unknown;
	};
};

export type HyperlinkProps = {
	linkDefault?: boolean;
	linkify?: LinkifyIt;
	linkStyle?: TextProps['style'];
	linkText?: ((url: string) => string) | string;
	onPress?: (url: string, text?: string) => void;
	onLongPress?: (url: string, text?: string) => void;
	injectViewProps?: (url: string) => TextProps;
	style?: ViewProps['style'];
	children?: ReactElementWithType;
};

export type HyperlinkState = { linkifyIt: LinkifyIt };
