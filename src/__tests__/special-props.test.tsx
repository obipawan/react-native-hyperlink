import type { ElementType, ReactNode } from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import Hyperlink from '../index';
import type { ReactElementWithType } from '../types';

// React defines `key` on a development element's props as a non-enumerable
// warning getter and freezes those props, so `key` must not be read and neither
// `key` nor `ref` can be deleted in place.
describe('React special props', () => {
	let errorSpy: jest.SpyInstance;

	beforeEach(() => {
		errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		errorSpy.mockRestore();
	});

	const keyWarnings = () =>
		errorSpy.mock.calls.filter(call =>
			String(call[0]).includes('`key` is not a prop'),
		);

	// React logs that warning only once per process, so each case builds its
	// keyed element with a freshly required React to stay independent.
	const createKeyedElement = (
		type: ElementType,
		props: Record<string, unknown>,
		...children: ReactNode[]
	): ReactElementWithType => {
		let element: ReactElementWithType | undefined;
		jest.isolateModules(() => {
			const { createElement } = require('react');
			element = createElement(type, props, ...children);
		});
		return element as ReactElementWithType;
	};

	it('should not read `key` when linkifying a keyed Text', () => {
		render(
			<Hyperlink linkStyle={{ color: 'blue' }}>
				{createKeyedElement(Text, { key: 'a' }, 'see https://example.com')}
			</Hyperlink>,
		);

		expect(keyWarnings()).toHaveLength(0);
	});

	it('should not read `key` when parsing a keyed non-Text child', () => {
		render(
			<Hyperlink linkStyle={{ color: 'blue' }}>
				{createKeyedElement(
					View,
					{ key: 'b' },
					<Text>see https://example.com</Text>,
				)}
			</Hyperlink>,
		);

		expect(keyWarnings()).toHaveLength(0);
	});

	it('should not read `key` when the Hyperlink itself has a key', () => {
		render(
			createKeyedElement(
				Hyperlink,
				{ key: 'c', linkStyle: { color: 'blue' } },
				<Text>see https://example.com</Text>,
			),
		);

		expect(keyWarnings()).toHaveLength(0);
	});

	it('should not mutate the frozen props of the elements it processes', () => {
		const child = createKeyedElement(
			Text,
			{ key: 'd', testID: 'child' },
			'see https://example.com',
		);
		expect(Object.isFrozen(child.props)).toBe(true);

		expect(() =>
			render(<Hyperlink linkStyle={{ color: 'blue' }}>{child}</Hyperlink>),
		).not.toThrow();

		expect(child.props.testID).toBe('child');
	});
});
