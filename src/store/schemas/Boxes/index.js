import { schema } from 'normalizr';
import PropTypes from 'prop-types';

import STATUSES from 'constants/app/boxes/statuses';
import EventSchema from 'store/schemas/Boxes/Events';
import SenderSchema from 'store/schemas/Boxes/Sender';

const entity = new schema.Entity('boxes', {
  events: EventSchema.collection,
  accesses: EventSchema.collection,
  lastEvent: EventSchema.entity,
  creator: SenderSchema.entity,
  members: SenderSchema.collection,
});

const collection = [entity];

const BoxesSchema = {
  entity,
  collection,
  propTypes: {
    publicKey: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    serverCreatedAt: PropTypes.string,
    lifecycle: PropTypes.oneOf(STATUSES),
    eventsCount: PropTypes.number,
    // eslint-disable-next-line react/forbid-foreign-prop-types
    events: PropTypes.arrayOf(PropTypes.shape(EventSchema.propTypes)),
    // eslint-disable-next-line react/forbid-foreign-prop-types
    accesses: PropTypes.arrayOf(PropTypes.shape(EventSchema.propTypes)),
    // eslint-disable-next-line react/forbid-foreign-prop-types
    creator: PropTypes.shape(SenderSchema.propTypes),
    // eslint-disable-next-line react/forbid-foreign-prop-types
    lastEvent: PropTypes.shape(EventSchema.propTypes),
    // eslint-disable-next-line react/forbid-foreign-prop-types
    members: PropTypes.arrayOf(PropTypes.shape(SenderSchema.propTypes)),
  },
};

export default BoxesSchema;
