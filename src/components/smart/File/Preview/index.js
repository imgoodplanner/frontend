import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import isNil from '@misakey/helpers/isNil';
import { useFileContext } from 'components/smart/File/Context';
import ImagePreview from './Image';
import MediaPreview from './MediaPreview';
import DefaultPreview from './Default';

// COMPONENTS
function FilePreview({
  allowedFileTypePreview,
  fallbackView,
  maxHeight, width, height, objectFit,
}) {
  const { fileType } = useFileContext();

  const nilFileType = useMemo(
    () => isNil(fileType),
    [fileType],
  );

  const isTypeAllowedForPreview = useMemo(
    () => !nilFileType && allowedFileTypePreview.some((type) => fileType.startsWith(type)),
    [nilFileType, allowedFileTypePreview, fileType],
  );

  const isImage = useMemo(
    () => !nilFileType && fileType.startsWith('image'),
    [nilFileType, fileType],
  );

  const isAudio = useMemo(
    () => !nilFileType && fileType.startsWith('audio'),
    [nilFileType, fileType],
  );

  const isVideo = useMemo(
    () => !nilFileType && fileType.startsWith('video'),
    [nilFileType, fileType],
  );

  if (!isTypeAllowedForPreview) {
    return fallbackView;
  }

  if (isImage) {
    return (
      <ImagePreview
        fallbackView={fallbackView}
        maxHeight={maxHeight}
        height={height}
        width={width}
        objectFit={objectFit}
      />
    );
  }
  if (isAudio || isVideo) {
    return <MediaPreview fallbackView={fallbackView} maxHeight={maxHeight} />;
  }

  return <DefaultPreview fallbackView={fallbackView} />;
}


FilePreview.propTypes = {
  allowedFileTypePreview: PropTypes.arrayOf(PropTypes.string).isRequired,
  fallbackView: PropTypes.node,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  objectFit: PropTypes.oneOf(['fill', 'contain', 'cover', 'none', 'scale-down']),
};

FilePreview.defaultProps = {
  maxHeight: '100%',
  width: 'auto',
  height: 'auto',
  fallbackView: null,
  objectFit: 'scale-down',
};

export default FilePreview;
