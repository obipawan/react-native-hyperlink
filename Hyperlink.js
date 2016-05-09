'use strict';

/**
* @flow
* @providesModule Hyperlink
**/

import React, {View, Text} from 'react-native';
const linkify = require('linkify-it')();

const Hyperlink = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    linkStyle: Text.propTypes.style,
    linkText: React.PropTypes.string
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

    try {
      linkify.match(component.props.children).forEach(({index, lastIndex, text, url}) => {
        let nonLinkedText = component.props.children.substring(_lastIndex, index);
        if (nonLinkedText) {
          elements.push(nonLinkedText);
        }
        _lastIndex = lastIndex;
        elements.push(
          <Text {...component.props}
            style={[component.props.style], [this.props.linkStyle]}
              onPress={() => {
            (this.props.onPress) ? this.props.onPress(url) : {}
          }}
            key={url}>{this.props.linkText || text}</Text>
        );
      });
      elements.push(component.props.children.substring(_lastIndex, component.props.children.length));
      return React.cloneElement(component, component.props, elements);
    } catch (err) {
      return component;
    }
  },

  parse(component){
    let {props: {children} = {}, type: {displayName} = {}} = component;
    if (!children){
      return component;
    }

    return React.cloneElement(component, component.props, React.Children.map(children, (child) => {
      let {type : {displayName} = {}} = child;
      if (typeof child === 'string' && linkify.pretest(child)){
        return this.linkify(<Text {...component.props} style={component.props.style}>{child}</Text>);
      }
      if (displayName === 'Text' && !this.isTextNested(child)){
        return this.linkify(child);
      }
      return this.parse(child);
    }));
  }
});

module.exports = Hyperlink;
