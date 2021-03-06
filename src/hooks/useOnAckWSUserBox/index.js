import isNil from '@misakey/helpers/isNil';
import objectToSnakeCaseDeep from '@misakey/helpers/objectToSnakeCaseDeep';

import { useCallback } from 'react';

export default (socketRef, senderId) => useCallback(
  (boxId) => {
    const { current } = socketRef;
    if (!isNil(current)) {
      current.send(JSON.stringify(objectToSnakeCaseDeep({
        type: 'ack',
        object: {
          boxId,
          senderId,
        },
      })));
    }
  },
  [senderId, socketRef],
);
