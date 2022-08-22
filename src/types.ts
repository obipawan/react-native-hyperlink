import type LinkifyIt from 'linkify-it';
import type { ReactElement } from 'react';
import type { TextProps, ViewProps } from 'react-native';

export type ReactElementWithType = ReactElement & {
	type?: { displayName?: string };
};

export type HyperlinkProps = {
	linkDefault?: boolean;
	linkify?: LinkifyIt.LinkifyIt;
	linkStyle?: TextProps['style'];
	linkText?: ((url: string) => string) | string;
	onPress?: (url: string, text?: string) => void;
	onLongPress?: (url: string, text?: string) => void;
	injectViewProps?: (url: string) => TextProps;
	style?: ViewProps['style'];
	children?: ReactElementWithType;
};

export type HyperlinkState = { linkifyIt: LinkifyIt.LinkifyIt };
