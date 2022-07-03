"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _deprecatedReactNativePropTypes = require("deprecated-react-native-prop-types");

var _reactNative = require("react-native");

var _mdurl = _interopRequireDefault(require("mdurl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var linkify = require('linkify-it')();

var textPropTypes = _deprecatedReactNativePropTypes.TextPropTypes || {};
var OS = _reactNative.Platform.OS;

var Hyperlink = /*#__PURE__*/function (_Component) {
  _inherits(Hyperlink, _Component);

  var _super = _createSuper(Hyperlink);

  function Hyperlink(props) {
    var _this;

    _classCallCheck(this, Hyperlink);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "linkify", function (component) {
      if (!_this.state.linkifyIt.pretest(component.props.children) || !_this.state.linkifyIt.test(component.props.children)) return component;
      var elements = [];
      var _lastIndex = 0;

      var componentProps = _objectSpread(_objectSpread({}, component.props), {}, {
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
          elements.push( /*#__PURE__*/_react["default"].createElement(_reactNative.Text, _extends({}, componentProps, clickHandlerProps, {
            key: url + index,
            style: [component.props.style, _this.props.linkStyle]
          }, _this.props.injectViewProps(url)), text));
        });

        elements.push(component.props.children.substring(_lastIndex, component.props.children.length));
        return /*#__PURE__*/_react["default"].cloneElement(component, componentProps, elements);
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

      var componentProps = _objectSpread(_objectSpread({}, component.props), {}, {
        ref: undefined,
        key: undefined
      });

      return /*#__PURE__*/_react["default"].cloneElement(component, componentProps, _react["default"].Children.map(children, function (child) {
        var _ref3 = child || {},
            _ref3$type = _ref3.type;

        _ref3$type = _ref3$type === void 0 ? {} : _ref3$type;
        var displayName = _ref3$type.displayName;
        if (typeof child === 'string' && _this.state.linkifyIt.pretest(child)) return _this.linkify( /*#__PURE__*/_react["default"].createElement(_reactNative.Text, _extends({}, componentProps, {
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
      return /*#__PURE__*/_react["default"].createElement(_reactNative.View, _extends({}, viewProps, {
        style: this.props.style
      }), !this.props.onPress && !this.props.onLongPress && !this.props.linkStyle ? this.props.children : this.parse(this).props.children);
    }
  }, {
    key: "isTextNested",
    value: function isTextNested(component) {
      if (! /*#__PURE__*/_react["default"].isValidElement(component)) throw new Error('Invalid component');
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
  onLongPress: _propTypes["default"].func,
  injectViewProps: _propTypes["default"].func
};
Hyperlink.defaultProps = {
  linkify: linkify,
  injectViewProps: function injectViewProps(i) {
    return {};
  }
};

Hyperlink.getDerivedStateFromProps = function (nextProps, prevState) {
  return nextProps.linkify !== prevState.linkifyIt ? {
    linkifyIt: nextProps.linkify
  } : null;
};

var _default = /*#__PURE__*/function (_Component2) {
  _inherits(_default, _Component2);

  var _super2 = _createSuper(_default);

  function _default(props) {
    var _this2;

    _classCallCheck(this, _default);

    _this2 = _super2.call(this, props);
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
      if (this.props.linkDefault) return /*#__PURE__*/_react["default"].createElement(Hyperlink, _extends({}, this.props, {
        onPress: onPress
      }));
      return /*#__PURE__*/_react["default"].createElement(Hyperlink, this.props);
    }
  }]);

  return _default;
}(_react.Component);

exports["default"] = _default;
