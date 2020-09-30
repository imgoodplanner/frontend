import { LIFECYCLE, MEMBER_JOIN, MEMBER_LEAVE, MEMBER_KICK } from 'constants/app/boxes/events';
import BoxesSchema from 'store/schemas/Boxes';
import BoxEventsSchema from 'store/schemas/Boxes/Events';
import { BLUR_TEXT, CLEAR_TEXT } from 'store/actions/box';

import createResetOnSignOutReducer from '@misakey/auth/store/reducers/helpers/createResetOnSignOutReducer';
import { createSelector } from 'reselect';
import { receiveEntities, updateEntities, removeEntities } from '@misakey/store/actions/entities';
import { normalize, denormalize } from 'normalizr';
import { mergeReceiveNoEmpty } from '@misakey/store/reducers/helpers/processStrategies';
import { transformReferrerEvent, isMemberEventType } from 'helpers/boxEvent';
import pluck from '@misakey/helpers/pluck';
import propOr from '@misakey/helpers/propOr';
import props from '@misakey/helpers/props';
import isNil from '@misakey/helpers/isNil';
import isEmpty from '@misakey/helpers/isEmpty';
import without from '@misakey/helpers/without';
import omit from '@misakey/helpers/omit';
import prop from '@misakey/helpers/prop';
import { identifierValuePath } from 'helpers/sender';

// CONSTANTS
const INITIAL_STATE = {};

// HELPERS
const omitText = (values) => omit(values, ['text']);
const textProp = prop('text');

const getNextMembers = ({ type, sender }, members) => {
  const senderIdentifierValue = identifierValuePath(sender);
  if (type === MEMBER_JOIN) {
    return members.concat([senderIdentifierValue]);
  }

  if (type === MEMBER_LEAVE || type === MEMBER_KICK) {
    return without(members, senderIdentifierValue);
  }

  return null;
};

// SELECTORS
export const makeDenormalizeBoxSelector = () => createSelector(
  (state) => state.entities,
  (_, id) => id,
  (entities, id) => denormalize(id, BoxesSchema.entity, entities),
);

export const makeGetMissingPublicKeysSelector = () => createSelector(
  (state) => state.entities,
  (_, properties) => properties,
  (entities, { publicKeysWeCanDecryptFrom, ids }) => denormalize(
    ids,
    BoxesSchema.collection,
    entities,
  )
    .filter(({ publicKey }) => !publicKeysWeCanDecryptFrom.has(publicKey)),
);

export const makeGetBoxesPublicKeysSelector = () => createSelector(
  (state) => state.entities.boxes,
  (_, ids) => ids,
  (entities, ids) => (isNil(ids) ? [] : pluck('publicKey', props(ids, entities))),
);

const getBoxSelector = createSelector(
  (state) => state.entities.boxes,
  (items) => (id) => propOr(null, id)(items),
);

const makeGetEventSelector = () => createSelector(
  (state) => state.entities,
  (_, eventId) => eventId,
  (entities, id) => denormalize(id, BoxEventsSchema.entity, entities),
);

const getBoxSendersIdsSelector = createSelector(
  (state) => state.entities,
  (items) => (id) => {
    const { events = [] } = denormalize(id, BoxesSchema.entity, items) || {};
    return [...new Set(pluck('sender', events))];
  },
);

export const getBoxById = (state, id) => getBoxSelector(state)(id);
export const getBoxSendersIds = (state, id) => getBoxSendersIdsSelector(state)(id);

// REDUCER SELECTORS
export const makeGetBoxText = () => createSelector(
  (state) => state.box,
  (_, boxId) => boxId,
  (boxState, boxId) => textProp(prop(boxId, boxState)),
);

// THUNKS
export const receiveJoinedBoxes = (boxes, processStrategy = mergeReceiveNoEmpty) => (dispatch) => {
  const normalized = normalize(
    boxes.map((box) => ({ isMember: true, hasAccess: true, ...box })),
    BoxesSchema.collection,
  );
  const { entities } = normalized;
  return Promise.resolve(
    dispatch(receiveEntities(entities, processStrategy)),
  ).then(() => normalized);
};

export const receiveJoinedBox = (box, processStrategy = mergeReceiveNoEmpty) => (
  dispatch, getState,
) => {
  const { id, lastEvent } = box;

  const nextBox = { isMember: true, hasAccess: true, ...box };
  if (isMemberEventType(lastEvent)) {
    const currentBox = getBoxById(getState(), id);
    if (!isNil(currentBox)) {
      const { members } = currentBox;
      if (!isEmpty(members)) {
        nextBox.members = getNextMembers(lastEvent, members);
      }
    }
  }

  const normalized = normalize(
    nextBox,
    BoxesSchema.entity,
  );
  const { entities } = normalized;
  return Promise.resolve(
    dispatch(receiveEntities(entities, processStrategy)),
  ).then(() => normalized);
};

export const removeBox = (id) => (dispatch, getState) => {
  const currentBox = getBoxById(getState(), id);

  const { events = [] } = currentBox;

  return Promise.all([
    dispatch(removeEntities(events, BoxEventsSchema)),
    dispatch(removeEntities([{ id }], BoxesSchema)),
  ]);
};

export const addBoxEvent = (id, nextEvent) => (dispatch, getState) => {
  const currentBox = getBoxById(getState(), id);
  const { events = [] } = currentBox;

  const lastEvent = nextEvent;
  const changes = {
    lastEvent,
    ...(lastEvent.type === LIFECYCLE ? { lifecycle: lastEvent.content.state } : {}),
    events: events.concat([nextEvent]),
  };

  const normalized = normalize(nextEvent, BoxEventsSchema.entity);
  const { entities } = normalized;

  return Promise.all([
    dispatch(receiveEntities(entities, mergeReceiveNoEmpty)),
    dispatch(updateEntities([{ id, changes }], BoxesSchema)),
  ]);
};

export const receiveBoxEvents = (id, nextEvents) => (dispatch, getState) => {
  const currentBox = getBoxById(getState(), id);
  const { events = [] } = currentBox;

  const changes = {
    events: events.concat(nextEvents),
  };

  const normalized = normalize(nextEvents, BoxEventsSchema.collection);
  const { entities } = normalized;

  return Promise.all([
    dispatch(receiveEntities(entities, mergeReceiveNoEmpty)),
    dispatch(updateEntities([{ id, changes }], BoxesSchema)),
  ]);
};

export const receiveWSEditEvent = (editEvent) => (dispatch, getState) => {
  const { referrerId } = editEvent;

  const getEventSelector = makeGetEventSelector();
  const referrerEvent = getEventSelector(getState(), referrerId);

  const changes = transformReferrerEvent(editEvent)(referrerEvent);

  return Promise.all([
    dispatch(updateEntities(
      [{ id: referrerId, changes }],
      BoxEventsSchema,
    )),
  ]);
};

export const updateAccessesEvents = (id, newAccesses) => (dispatch) => {
  const normalized = normalize(newAccesses, BoxEventsSchema.collection);
  const { entities, result } = normalized;
  const changes = {
    accesses: result,
  };

  return Promise.all([
    dispatch(receiveEntities(entities, mergeReceiveNoEmpty)),
    dispatch(updateEntities([{ id, changes }], BoxesSchema)),
  ]);
};

// REDUCER

// CALLBACKS
const onBlurText = (state, { boxId, text }) => ({ ...state, [boxId]: { text } });

const onClearText = (state, { boxId }) => {
  if (isNil(state[boxId])) {
    return state;
  }
  return { ...state, [boxId]: omitText(state[boxId]) };
};

const boxReducer = createResetOnSignOutReducer(INITIAL_STATE, {
  [BLUR_TEXT]: onBlurText,
  [CLEAR_TEXT]: onClearText,
});

export default {
  box: boxReducer,
};