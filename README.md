# ink-multicolumn-select-input ![ci](https://img.shields.io/github/actions/workflow/status/chung-leong/ink-multicolumn-select-input/node.js.yml?branch=main&label=Node.js%20CI&logo=github) ![nycrc config on GitHub](https://img.shields.io/nycrc/chung-leong/ink-multicolumn-select-input)

Multi-column select input component for [Ink](https://github.com/vadimdemedes/ink)

![Screenshot](./screenshot.png)

## Install

```
$ npm install ink-multicolumn-select-input
```

## Usage

```jsx
import React from 'react';
import {render} from 'ink';
import MulticolumnSelectInput from 'ink-multicolumn-select-input';

const Demo = () => {
  const handleSelect = item => {
    // `item` = { label: 'First', value: 'first' }
  };

  const items = [];
  for (let i = 1; i <= 150; i++) {
    const filename = `filename${i}.ext`;
    items.push({ label: filename, value: filename });
  }

  return <MulticolumnSelectInput items={items} columnCount={3} onSelect={handleSelect} />;
};

render(<Demo />);
```

## Props

### items

Type: `array`<br>
Default: `[]`

Items to display in a list. Each item must be an object and have `label` and `value` props.

### isFocused

Type: `boolean`<br>
Default: `true`

Listen to user's input. Useful in case there are multiple input components at the same time and input must be "routed" to a specific component.

### initialIndex

Type: `number`<br>
Default: `0`

Index of initially-selected item in `items` array.

### limit

Type: `number`<br>
Default: `24`

Number of items in a column. Determines the height of the component.

### columnCount

Type: `number`<br>
Default: `3`

Number of columns.

### width

Type: `number` | `string`<br>
Default: `"100%"`

The width of the component. 

### indicatorComponent

Type: `Component`

Custom component to override the default indicator component.

### itemComponent

Type: `Component`

Custom component to override the default item component.

### onSelect

Type: `function`

Function to call when user selects an item. Item object is passed to that function as an argument.

### onHighlight

Type: `function`

Function to call when user highlights an item. Item object is passed to that function as an argument.