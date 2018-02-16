'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactNative = require('react-native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @providesModule Hyperlink
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               **/

var textPropTypes = _reactNative.Text.propTypes || {};
var OS = _reactNative.Platform.OS;

var Hyperlink = function (_Component) {
  _inherits(Hyperlink, _Component);

  function Hyperlink(props) {
    _classCallCheck(this, Hyperlink);

    var _this = _possibleConstructorReturn(this, (Hyperlink.__proto__ || Object.getPrototypeOf(Hyperlink)).call(this, props));

    _this.linkify = _this.linkify.bind(_this);
    _this.parse = _this.parse.bind(_this);
    _this.linkifyIt = props.linkify || require('linkify-it')();
    return _this;
  }

  _createClass(Hyperlink, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$linkify = _ref.linkify,
          linkify = _ref$linkify === undefined ? require('linkify-it')() : _ref$linkify;

      this.linkifyIt = linkify;
    }
  }, {
    key: 'render',
    value: function render() {
      var viewProps = _objectWithoutProperties(this.props, []);

      delete viewProps.onPress;
      delete viewProps.linkDefault;
      delete viewProps.onLongPress;
      delete viewProps.linkStyle;

      return _react2.default.createElement(
        _reactNative.View,
        _extends({}, viewProps, { style: this.props.style }),
        !this.props.onPress && !this.props.onLongPress && !this.props.linkStyle ? this.props.children : this.parse(this).props.children
      );
    }
  }, {
    key: 'isTextNested',
    value: function isTextNested(component) {
      if (!_react2.default.isValidElement(component)) throw new Error('Invalid component');
      var _component$type = component.type;
      _component$type = _component$type === undefined ? {} : _component$type;
      var displayName = _component$type.displayName;

      if (displayName !== 'Text') throw new Error('Not a Text component');
      return typeof component.props.children !== 'string';
    }
  }, {
    key: 'linkify',
    value: function linkify(component) {
      var _this2 = this;

      if (!this.linkifyIt.pretest(component.props.children) || !this.linkifyIt.test(component.props.children)) return component;

      var elements = [];
      var _lastIndex = 0;

      var componentProps = _extends({}, component.props, {
        ref: undefined,
        key: undefined
      });

      try {
        this.linkifyIt.match(component.props.children).forEach(function (_ref2) {
          var index = _ref2.index,
              lastIndex = _ref2.lastIndex,
              text = _ref2.text,
              url = _ref2.url;

          var nonLinkedText = component.props.children.substring(_lastIndex, index);
          nonLinkedText && elements.push(nonLinkedText);
          _lastIndex = lastIndex;
          if (_this2.props.linkText) text = typeof _this2.props.linkText === 'function' ? _this2.props.linkText(url) : _this2.props.linkText;

          var linkComponentProps = {};
          if (OS !== 'web') {
            linkComponentProps.onLongPress = function () {
              return _this2.props.onLongPress && _this2.props.onLongPress(url, text);
            };
          }

          elements.push(_react2.default.createElement(
            _reactNative.Text,
            _extends({}, componentProps, linkComponentProps, {
              key: url + index,
              style: [component.props.style, _this2.props.linkStyle],
              onPress: function onPress() {
                return _this2.props.onPress && _this2.props.onPress(url, text);
              }
            }),
            text
          ));
        });
        elements.push(component.props.children.substring(_lastIndex, component.props.children.length));
        return _react2.default.cloneElement(component, componentProps, elements);
      } catch (err) {
        return component;
      }
    }
  }, {
    key: 'parse',
    value: function parse(component) {
      var _this3 = this;

      var _component$props = component.props;
      _component$props = _component$props === undefined ? {} : _component$props;
      var children = _component$props.children,
          _component$type2 = component.type;
      _component$type2 = _component$type2 === undefined ? {} : _component$type2;
      var displayName = _component$type2.displayName;

      if (!children) return component;

      var componentProps = _extends({}, component.props, {
        ref: undefined,
        key: undefined
      });

      return _react2.default.cloneElement(component, componentProps, _react2.default.Children.map(children, function (child) {
        var _child$type = child.type;
        _child$type = _child$type === undefined ? {} : _child$type;
        var displayName = _child$type.displayName;

        if (typeof child === 'string' && _this3.linkifyIt.pretest(child)) return _this3.linkify(_react2.default.createElement(
          _reactNative.Text,
          _extends({}, componentProps, { style: component.props.style }),
          child
        ));
        if (displayName === 'Text' && !_this3.isTextNested(child)) return _this3.linkify(child);
        return _this3.parse(child);
      }));
    }
  }]);

  return Hyperlink;
}(_react.Component);

Hyperlink.propTypes = {
  linkDefault: _propTypes2.default.bool,
  linkify: _propTypes2.default.object,
  linkStyle: textPropTypes.style,
  linkText: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  onPress: _propTypes2.default.func,
  onLongPress: _propTypes2.default.func
};

var _class = function (_Component2) {
  _inherits(_class, _Component2);

  function _class(props) {
    _classCallCheck(this, _class);

    var _this4 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

    _this4.handleLink = _this4.handleLink.bind(_this4);
    return _this4;
  }

  _createClass(_class, [{
    key: 'handleLink',
    value: function handleLink(url) {
      _reactNative.Linking.canOpenURL(url).then(function (supported) {
        return supported && _reactNative.Linking.openURL(url);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var onPress = this.handleLink || this.props.onPress;
      if (this.props.linkDefault) return _react2.default.createElement(Hyperlink, _extends({}, this.props, { onPress: onPress }));
      return _react2.default.createElement(Hyperlink, this.props);
    }
  }]);

  return _class;
}(_react.Component);

exports.default = _class;
