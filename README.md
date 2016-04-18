# react-native-hyperlink
A `<Hyperlink />` component for react-native that makes urls, fuzzy links, emails etc clickable

![demo](https://cdn.rawgit.com/obipawan/hyperlink/master/asset/screen.gif)

## Installation
```sh
npm install --save react-native-hyperlink
```

## Usage
 - To make a `<Text />` component **linkable**, first import the component
```javascript
import Hyperlink from 'react-native-hyperlink';
```

and nest your `<Text />` as a child.

```javascript
module.exports = React.createClass({
    render(){
        <Hyperlink onPress={(url) => alert(url)}>
            <Text style={{fontSize:15}}>
                This text will be parsed to check for clickable strings like https://github.com/obipawan/hyperlink and made clickable.
            </Text>
        </Hyperlink>
    }
});
```
  - You can also wrap `<Hyperlink />` around [nested ](https://facebook.github.io/react-native/docs/text.html#nested-text) `<Text />` and any views with `<Text />`
```javascript
    module.exports = React.createClass({
    render(){
        <Hyperlink onPress={(url) => alert(url)}>
            <View>
                <Text style={{fontSize:15}}>
                A nested Text component https://facebook.github.io/react-native/docs/text.html works equally well <Text>with https://github.com/obipawan/hyperlink</Text>
                </Text>
            </View>
        </Hyperlink>
    }
});
```

  - To highlight clickable links, specify `linkStyle` prop

```javascript
module.exports = React.createClass({
    render(){
        <Hyperlink linkStyle={{color:'#2980b9', fontSize:20}}>
            <Text style={{fontSize:15}}>
                Make clickable strings like https://github.com/obipawan/hyperlink stylable
            </Text>
        </Hyperlink>
    }
});
```

  - Use the `linkText` prop to change the visible text
```javascript
module.exports = React.createClass({
    render(){
        <Hyperlink linkStyle={{color:'#2980b9', fontSize:20}}
                    linkText={'hyperlink'}>
            <Text style={{fontSize:15}}>
                Make clickable strings cleaner with https://github.com/obipawan/hyperlink
            </Text>
        </Hyperlink>
    }
});
```
### Dependenies
 [linkify-it](https://github.com/markdown-it/linkify-it)
### Development

PRs highly appreciated

License
----
MIT License
