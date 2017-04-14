/**
* @providesModule Hyperlink
**/

import React, { Component, PropTypes } from 'react'
import { View, Text } from 'react-native'

const textPropTypes = Text.propTypes || {}

class Hyperlink extends Component {
	constructor(props){
		super(props)
		this.linkify = this.linkify.bind(this)
		this.parse = this.parse.bind(this)
		this.linkifyIt = props.linkify || require('linkify-it')()
	}

	render(){
		return <View
			{ ...this.props }
			style={ this.props.style }
		>
			{
				!this.props.onPress && !this.props.onLongPress && !this.props.linkStyle
					? this.props.children
					: this.parse(this).props.children
			}
		</View>
	}

	isTextNested(component){
		if (!React.isValidElement(component))
			throw 'Invalid component'
		let { type : { displayName } = {} } = component
		if (displayName !== 'Text')
			throw 'Not a Text component'
		return typeof component.props.children !== 'string'
	}

	linkify(component){
		if (
			!this.linkifyIt.pretest(component.props.children)
			|| !this.linkifyIt.test(component.props.children)
		)
			return component

		let elements = []
		let _lastIndex = 0

		const componentProps = {
			...component.props,
			ref: undefined,
			key: undefined,
		}

		try {
			this.linkifyIt.match(component.props.children).forEach(({ index, lastIndex, text, url }) => {
				let nonLinkedText = component.props.children.substring(_lastIndex, index)
				nonLinkedText && elements.push(nonLinkedText)
				_lastIndex = lastIndex
				if (this.props.linkText)
					text = typeof this.props.linkText === 'function'
						? this.props.linkText(url)
						: this.props.linkText

				elements.push(
					<Text
						{ ...componentProps }
						key={ url + index }
						style={ [ component.props.style, this.props.linkStyle ] }
						onPress={ () => this.props.onPress && this.props.onPress(url) }
						onLongPress={ () => this.props.onLongPress && this.props.onLongPress(url) }
					>
						{ text }
					</Text>
				)
			})
			elements.push(component.props.children.substring(_lastIndex, component.props.children.length))
			return React.cloneElement(component, componentProps, elements)
		} catch (err) {
			return component
		}
	}

	parse (component) {
		let { props: { children} = {}, type: { displayName } = {} } = component
		if (!children)
			return component

		const componentProps = {
			...component.props,
			ref: undefined,
			key: undefined,
		}

		return React.cloneElement(component, componentProps, React.Children.map(children, child => {
			let { type : { displayName } = {} } = child
			if (typeof child === 'string' && this.linkifyIt.pretest(child))
				return this.linkify(<Text { ...componentProps } style={ component.props.style }>{ child }</Text>)
			if (displayName === 'Text' && !this.isTextNested(child))
				return this.linkify(child)
			return this.parse(child)
		}))
	}
}

Hyperlink.propTypes = {
	linkify: PropTypes.object,
	linkStyle: textPropTypes.style,
	linkText: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	onPress: PropTypes.func,
	onLongPress: PropTypes.func,
}

module.exports = Hyperlink
