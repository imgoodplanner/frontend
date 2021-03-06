import React from 'react';

import useAvatarSize from '@misakey/hooks/useAvatarSize';

import Skeleton from '@material-ui/lab/Skeleton';

const AvatarBoxSkeleton = (props) => {
  const size = useAvatarSize();
  return (
    <Skeleton variant="circle" width={size} height={size} {...props} />
  );
};

export default AvatarBoxSkeleton;
