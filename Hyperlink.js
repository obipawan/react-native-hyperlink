'use strict';

/**
* @flow
* @providesModule Hyperlink
**/

import React from 'react';
import {View, Text} from 'react-native';
const linkify = require('linkify-it')();

const Hyperlink = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    linkStyle: Text.propTypes.style,
    linkText: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ])
  },

  render(){
    return (
      <View {...this.props} style={this.props.style}>
        {(!this.props.onPress && !this.props.linkStyle) ? this.props.children : this.parse(this).props.children}
      </View>
    );
  },

  isTextNested(component){
    if (!React.isValidElement(component)){
      throw 'Invalid component';
    }
    let {type : {displayName} = {}} = component;
    if (displayName !== 'Text') {
      throw 'Not a Text component';
    }
    return typeof component.props.children !== 'string';
  },

  linkify(component){
    if (!linkify.pretest(component.props.children) || !linkify.test(component.props.children)) {
      return component;
    }
    let elements = [];
    let _lastIndex = 0;

    const componentProps = {
      ...component.props,
      ref: undefined,
      key: undefined,
    }

    try {
      linkify.match(component.props.children).forEach(({index, lastIndex, text, url}) => {
        let nonLinkedText = component.props.children.substring(_lastIndex, index);
        if (nonLinkedText) {
          elements.push(nonLinkedText);
        }
        _lastIndex = lastIndex;
        if (this.props.linkText){
          text = (typeof this.props.linkText === 'function') ? this.props.linkText(url) : this.props.linkText;
        }

        elements.push(
          <Text {...componentProps}
            style={[component.props.style], [this.props.linkStyle]}
            onPress={() => this.props.onPress && this.props.onPress(url)}
            key={url}>{text}</Text>
        );
      });
      elements.push(component.props.children.substring(_lastIndex, component.props.children.length));
      return React.cloneElement(component, componentProps, elements);
    } catch (err) {
      return component;
    }
  },

  parse(component){
    let {props: {children} = {}, type: {displayName} = {}} = component;
    if (!children){
      return component;
    }

    const componentProps = {
      ...component.props,
      ref: undefined,
      key: undefined,
    }

    return React.cloneElement(component, componentProps, React.Children.map(children, (child) => {
      let {type : {displayName} = {}} = child;
      if (typeof child === 'string' && linkify.pretest(child)){
        return this.linkify(<Text {...componentProps} style={component.props.style}>{child}</Text>);
      }
      if (displayName === 'Text' && !this.isTextNested(child)){
        return this.linkify(child);
      }
      return this.parse(child);
    }));
  }
});

module.exports = Hyperlink;
