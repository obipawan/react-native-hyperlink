# react-native-hyperlink
[![NPM version](https://badge.fury.io/js/react-native-hyperlink.svg)](http://badge.fury.io/js/react-native-hyperlink) [![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/jondot/awesome-react-native#text--rich-content)

A `<Hyperlink />` component for [react-native](http://facebook.github.io/react-native/) & [react-native-web](https://github.com/necolas/react-native-web) that makes urls, fuzzy links, emails etc clickable

![demo](https://cdn.rawgit.com/obipawan/hyperlink/master/asset/screen.gif)

## Installation
```sh
npm i --save react-native-hyperlink
```

## Props
| name | desc | type | default
| --- | --- | --- | --- |
| `linkify` | [linkify-it](https://facebook.github.io/react-native/docs/view.html#style) object, for custom schema  | `object` | `require('linkify-it')()`
| `linkStyle` | highlight clickable text with styles | `Text.propTypes.style` |
| `linkText` | A string or a func to replace parsed text | `oneOfType([ string, func ])` |
| `onPress` | func to handle click over a clickable text with parsed text as arg | `func` |
| `onLongPress` | func to handle long click over a clickable text with parsed text as arg | `func` |
|`linkDefault`|A platform specific fallback to handle `onPress`. Uses [Linking](https://facebook.github.io/react-native/docs/linking.html). Disabled by default | `bool`

## Examples
Wrap any component that has `<Text>` (works for [nested ](https://facebook.github.io/react-native/docs/text.html#nested-text) text too) in it

```javascript
import Hyperlink from 'react-native-hyperlink'

export const defaultLink = () =>
  <Hyperlink linkDefault={ true }>
    <Text style={ { fontSize: 15 } }>
      This text will be parsed to check for clickable strings like https://github.com/obipawan/hyperlink and made clickable.
    </Text>
  </Hyperlink>

export const regularText = () =>
  <Hyperlink onPress={ url => alert(url) }>
    <Text style={ { fontSize: 15 } }>
      This text will be parsed to check for clickable strings like https://github.com/obipawan/hyperlink and made clickable.
    </Text>
  </Hyperlink>

export const regularTextLongPress = () =>
  <Hyperlink onLongPress={ url => alert(url) }>
    <Text style={ { fontSize: 15 } }>
      This text will be parsed to check for clickable strings like https://github.com/obipawan/hyperlink and made clickable for long click.
    </Text>
  </Hyperlink>

export const nestedText = () =>
  <Hyperlink onPress={ url => alert(url) }>
    <View>
      <Text style={ { fontSize: 15 } }>
        A nested Text component https://facebook.github.io/react-native/docs/text.html works equally well <Text>with https://github.com/obipawan/hyperlink</Text>
      </Text>
    </View>
  </Hyperlink>

export const highlightText = () =>
  <Hyperlink linkStyle={ { color: '#2980b9', fontSize: 20 } }>
    <Text style={ { fontSize: 15 } }>
      Make clickable strings like https://github.com/obipawan/hyperlink stylable
    </Text>
  </Hyperlink>

export const parseAndReplace = () =>
  <Hyperlink
    linkStyle={ { color: '#2980b9', fontSize: 20 } }
    linkText={ url => url === 'https://github.com/obipawan/hyperlink' ? 'Hyperlink' : url }
  >
    <Text style={ { fontSize: 15 } }>
      Make clickable strings cleaner with https://github.com/obipawan/hyperlink
    </Text>
  </Hyperlink>
```

### Dependenies
 [linkify-it](https://github.com/markdown-it/linkify-it)
### Development

PRs highly appreciated

License
----
MIT License
