/**
* @providesModule Hyperlink
**/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	View,
	Text,
	Linking,
	Platform
} from 'react-native'
import mdurl from 'mdurl';

const textPropTypes = Text.propTypes || {}
const { OS } = Platform

class Hyperlink extends Component {
  constructor(props){
    super(props)
    this.linkify = this.linkify.bind(this)
    this.parse = this.parse.bind(this)
    this.linkifyIt = props.linkify || require('linkify-it')()
  }

  componentWillReceiveProps ({ linkify = require('linkify-it')() } = {}) {
    this.linkifyIt = linkify
  }

  render() {
    const { ...wrapperProps } = this.props
    delete wrapperProps.onPress
    delete wrapperProps.linkDefault
    delete wrapperProps.onLongPress
    delete wrapperProps.linkStyle
    delete wrapperProps.wrapperComponent

    const Wrapper = this.props.wrapperComponent || View;

    return (
      <Wrapper { ...wrapperProps } style={ this.props.style }>
        { !this.props.onPress && !this.props.onLongPress && !this.props.linkStyle
          ? this.props.children
          : this.parse(this).props.children }
      </Wrapper>
    )
  }

  isTextNested(component) {
    if (!React.isValidElement(component))
      throw new Error('Invalid component')
    let { type: { displayName } = {} } = component
    if (displayName !== 'Text')
      throw new Error('Not a Text component')
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

        const clickHandlerProps = {}
        if (OS !== 'web') {
          clickHandlerProps.onLongPress = this.props.onLongPress
            ? () => this.props.onLongPress(url, text)
            : undefined
        }
        clickHandlerProps.onPress = this.props.onPress
          ? () => this.props.onPress(url, text)
          : undefined

        elements.push(
          <Text
            { ...componentProps }
            { ...clickHandlerProps }
            key={ url + index }
            style={ [ component.props.style, this.props.linkStyle ] }
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
    let {
        props: { children } = {},
        type: { displayName } = {},
    } = component || {}
    if (!children)
      return component

    const componentProps = {
      ...component.props,
      ref: undefined,
      key: undefined,
    }

    return React.cloneElement(component, componentProps, React.Children.map(children, child => {
      let { type : { displayName } = {} } = child || {}
      if (typeof child === 'string' && this.linkifyIt.pretest(child))
        return this.linkify(<Text { ...componentProps } style={ component.props.style }>{ child }</Text>)
		  if (displayName === 'Text' && !this.isTextNested(child))
			  return this.linkify(child)
		  return this.parse(child)
    }))
  }
}

Hyperlink.propTypes = {
  linkDefault: PropTypes.bool,
  linkify: PropTypes.object,
  linkStyle: textPropTypes.style,
  linkText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  wrapperComponent: PropTypes.elementType,
}

export default class extends Component {
  constructor (props) {
    super(props)
    this.handleLink = this.handleLink.bind(this)
  }

  handleLink (url) {
    const urlObject = mdurl.parse(url);
    urlObject.protocol = urlObject.protocol.toLowerCase();
    const normalizedURL = mdurl.format(urlObject)

    Linking.canOpenURL(normalizedURL)
      .then(supported => supported && Linking.openURL(normalizedURL));
  }

  render () {
    const onPress = this.handleLink || this.props.onPress
	if (this.props.linkDefault)
		return <Hyperlink { ...this.props } onPress={ onPress }/>
    return <Hyperlink { ...this.props } />
  }
}
