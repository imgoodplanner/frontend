FileField example:

```js
import React from 'react';
import FileField from './index';

const ACCEPTED_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/gif',
];

const onChange = console.log;

const FileFieldExample = () => (
  <React.Suspense fallback="Loading...">
    <FileField
      accept={ACCEPTED_TYPES}
      onChange={onChange}
    />
  </React.Suspense>
);

  <FileFieldExample />;
```
