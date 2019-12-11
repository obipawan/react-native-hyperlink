"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactNative = require("react-native");

var _mdurl = _interopRequireDefault(require("mdurl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var linkify = require('linkify-it')();

var textPropTypes = _reactNative.Text.propTypes || {};
var OS = _reactNative.Platform.OS;

var Hyperlink =
/*#__PURE__*/
function (_Component) {
  _inherits(Hyperlink, _Component);

  function Hyperlink(props) {
    var _this;

    _classCallCheck(this, Hyperlink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Hyperlink).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "linkify", function (component) {
      if (!_this.state.linkifyIt.pretest(component.props.children) || !_this.state.linkifyIt.test(component.props.children)) return component;
      var elements = [];
      var _lastIndex = 0;

      var componentProps = _objectSpread({}, component.props, {
        ref: undefined,
        key: undefined
      });

      try {
        _this.state.linkifyIt.match(component.props.children).forEach(function (_ref) {
          var index = _ref.index,
              lastIndex = _ref.lastIndex,
              text = _ref.text,
              url = _ref.url;
          var nonLinkedText = component.props.children.substring(_lastIndex, index);
          nonLinkedText && elements.push(nonLinkedText);
          _lastIndex = lastIndex;
          if (_this.props.linkText) text = typeof _this.props.linkText === 'function' ? _this.props.linkText(url) : _this.props.linkText;
          var clickHandlerProps = {};

          if (OS !== 'web') {
            clickHandlerProps.onLongPress = _this.props.onLongPress ? function () {
              return _this.props.onLongPress(url, text);
            } : undefined;
          }

          clickHandlerProps.onPress = _this.props.onPress ? function () {
            return _this.props.onPress(url, text);
          } : undefined;
          elements.push(_react["default"].createElement(_reactNative.Text, _extends({}, componentProps, clickHandlerProps, {
            key: url + index,
            style: [component.props.style, _this.props.linkStyle]
          }), text));
        });

        elements.push(component.props.children.substring(_lastIndex, component.props.children.length));
        return _react["default"].cloneElement(component, componentProps, elements);
      } catch (err) {
        return component;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "parse", function (component) {
      var _ref2 = component || {},
          _ref2$props = _ref2.props;

      _ref2$props = _ref2$props === void 0 ? {} : _ref2$props;
      var children = _ref2$props.children;
      if (!children) return component;

      var componentProps = _objectSpread({}, component.props, {
        ref: undefined,
        key: undefined
      });

      return _react["default"].cloneElement(component, componentProps, _react["default"].Children.map(children, function (child) {
        var _ref3 = child || {},
            _ref3$type = _ref3.type;

        _ref3$type = _ref3$type === void 0 ? {} : _ref3$type;
        var displayName = _ref3$type.displayName;
        if (typeof child === 'string' && _this.state.linkifyIt.pretest(child)) return _this.linkify(_react["default"].createElement(_reactNative.Text, _extends({}, componentProps, {
          style: component.props.style
        }), child));
        if (displayName === 'Text' && !_this.isTextNested(child)) return _this.linkify(child);
        return _this.parse(child);
      }));
    });

    _this.state = {
      linkifyIt: props.linkify || linkify
    };
    return _this;
  }

  _createClass(Hyperlink, [{
    key: "render",
    value: function render() {
      var viewProps = _extends({}, this.props);

      delete viewProps.onPress;
      delete viewProps.linkDefault;
      delete viewProps.onLongPress;
      delete viewProps.linkStyle;
      return _react["default"].createElement(_reactNative.View, _extends({}, viewProps, {
        style: this.props.style
      }), !this.props.onPress && !this.props.onLongPress && !this.props.linkStyle ? this.props.children : this.parse(this).props.children);
    }
  }, {
    key: "isTextNested",
    value: function isTextNested(component) {
      if (!_react["default"].isValidElement(component)) throw new Error('Invalid component');
      var _component$type = component.type;
      _component$type = _component$type === void 0 ? {} : _component$type;
      var displayName = _component$type.displayName;
      if (displayName !== 'Text') throw new Error('Not a Text component');
      return typeof component.props.children !== 'string';
    }
  }]);

  return Hyperlink;
}(_react.Component);

Hyperlink.propTypes = {
  linkDefault: _propTypes["default"].bool,
  linkify: _propTypes["default"].object,
  linkStyle: textPropTypes.style,
  linkText: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  onPress: _propTypes["default"].func,
  onLongPress: _propTypes["default"].func
};
Hyperlink.defaultProps = {
  linkify: linkify
};

Hyperlink.getDerivedStateFromProps = function (nextProps, prevState) {
  return nextProps.linkify !== prevState.linkifyIt ? {
    linkifyIt: nextProps.linkify
  } : null;
};

var _default =
/*#__PURE__*/
function (_Component2) {
  _inherits(_default, _Component2);

  function _default(props) {
    var _this2;

    _classCallCheck(this, _default);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, props));
    _this2.handleLink = _this2.handleLink.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(_default, [{
    key: "handleLink",
    value: function handleLink(url) {
      var urlObject = _mdurl["default"].parse(url);

      urlObject.protocol = urlObject.protocol.toLowerCase();

      var normalizedURL = _mdurl["default"].format(urlObject);

      _reactNative.Linking.canOpenURL(normalizedURL).then(function (supported) {
        return supported && _reactNative.Linking.openURL(normalizedURL);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var onPress = this.handleLink || this.props.onPress;
      if (this.props.linkDefault) return _react["default"].createElement(Hyperlink, _extends({}, this.props, {
        onPress: onPress
      }));
      return _react["default"].createElement(Hyperlink, this.props);
    }
  }]);

  return _default;
}(_react.Component);

exports["default"] = _default;
