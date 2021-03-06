import { schema } from 'normalizr';
import PropTypes from 'prop-types';

const entity = new schema.Entity('eventSenders', {}, {
  idAttribute: (value) => value.identifierId,
});

const collection = [entity];

const SenderSchema = {
  entity,
  collection,
  propTypes: {
    displayName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    identifierId: PropTypes.string.isRequired,
    identifier: PropTypes.shape({
      value: PropTypes.string,
      kind: PropTypes.string,
    }).isRequired,
  },
};

export default SenderSchema;
