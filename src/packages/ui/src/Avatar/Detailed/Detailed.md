#### Image

```js
import React from 'react';
import lemur from '@misakey/ui/lemur';
import AvatarDetailed from './index';

const mock = {
  text: 'Lemur',
  image: lemur,
  title: 'Lemur',
  subtitle: 'Lemurs are mammals of the order Primates',
};

const AvatarDetailedExample = () => (
  <AvatarDetailed
    {...mock}
  />
);

  <AvatarDetailedExample />;
```


#### First letter

```js
import React from 'react';
import AvatarDetailed from './index';


const mock = {
  text: 'Lemur',
  title: 'Lemur',
  subtitle: 'Lemurs are mammals of the order Primates',
};

const AvatarDetailedExample = () => (
  <AvatarDetailed
    {...mock}
  />
);

  <AvatarDetailedExample />;
```
