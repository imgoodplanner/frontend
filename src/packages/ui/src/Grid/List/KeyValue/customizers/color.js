import React from 'react';

import isHexColor from '@misakey/helpers/isHexColor';
import Color from '@misakey/ui/Color';

function match(value) {
  return isHexColor(value);
}

function format(value, key) {
  return <Color color={value} key={key} />;
}

export default [match, format];