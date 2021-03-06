import { selectors as authSelectors } from '@misakey/auth/store/reducers/auth';
import routes from 'routes';
import BoxesSchema from 'store/schemas/Boxes';
import { DELETED_BOX, NEW_EVENT, NOTIFICATIONS_ACK } from 'constants/app/boxes/ws/messageTypes';
import { CHANGE_EVENT_TYPES } from 'constants/app/boxes/events';
import { receiveWSEditEvent, addBoxEvent } from 'store/reducers/box';
import { updateEntities } from '@misakey/store/actions/entities';

import { isMeLeaveEvent, isMeKickEvent, isMeJoinEvent, isMeEvent } from 'helpers/boxEvent';
import path from '@misakey/helpers/path';
import isNil from '@misakey/helpers/isNil';
import log from '@misakey/helpers/log';

import { useSelector, useDispatch, batch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useOnRemoveBox } from 'hooks/usePaginateBoxesByStatus/updates';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useModifier from '@misakey/hooks/useModifier';

// CONSTANTS
const {
  identityId: IDENTITY_ID_SELECTOR,
  identifierId: IDENTIFIER_ID_SELECTOR,
} = authSelectors;

// HELPERS
const idParamPath = path(['params', 'id']);

// HOOKS
export default (activeStatus, search) => {
  const onRemoveBox = useOnRemoveBox(activeStatus, search);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('boxes');
  const tRef = useRef(t);

  const matchBoxSelected = useRouteMatch(routes.boxes.read._);
  const id = useModifier(idParamPath, matchBoxSelected);
  const idRef = useRef(id);

  const { replace } = useHistory();

  const idMatchesDeletedBoxId = useCallback(
    ({ id: boxId }) => idRef.current === boxId,
    [idRef],
  );

  useEffect(
    () => {
      tRef.current = t;
      idRef.current = id;
    },
    [tRef, t, idRef, id],
  );

  const leaveSuccess = useMemo(
    () => t('boxes:removeBox.success.leave'),
    [t],
  );

  const identityId = useSelector(IDENTITY_ID_SELECTOR);
  const identifierId = useSelector(IDENTIFIER_ID_SELECTOR);

  const onDeleteSuccess = useCallback(
    (box) => {
      const { title, senderId } = box;
      if (senderId === identityId) {
        enqueueSnackbar(tRef.current('boxes:removeBox.success.delete.you'), { variant: 'success' });
      } else if (!isNil(title)) {
        // This information will be handled by user notifications later
        enqueueSnackbar(
          tRef.current('boxes:removeBox.success.delete.they', { title }),
          { variant: 'warning', persist: true },
        );
      }
      if (idMatchesDeletedBoxId(box)) {
        return replace(routes.boxes._);
      }
      return Promise.resolve();
    },
    [identityId, enqueueSnackbar, tRef, idMatchesDeletedBoxId, replace],
  );

  const onKickSuccess = useCallback(
    (box) => {
      const { title } = box;
      if (!isNil(title)) {
        // This will be handled by user notifications later
        enqueueSnackbar(tRef.current('boxes:removeBox.success.kick', box), { variant: 'info' });
      }
      if (idMatchesDeletedBoxId(box)) {
        replace(routes.boxes._);
      }
    },
    [enqueueSnackbar, idMatchesDeletedBoxId, replace],
  );

  return useCallback(
    ({ type, object }) => {
      // delete box
      if (type === DELETED_BOX) {
        const { id: boxId } = object;
        return onRemoveBox(boxId).then((box) => onDeleteSuccess({ ...box, ...object }));
      }

      if (type === NOTIFICATIONS_ACK) {
        const { boxId } = object;
        return Promise.resolve(
          dispatch(updateEntities([{ id: boxId, changes: { eventsCount: 0 } }], BoxesSchema)),
        );
      }

      // New event
      if (type === NEW_EVENT) {
        const { referrerId, type: eventType, boxId } = object;
        if (CHANGE_EVENT_TYPES.includes(eventType) && !isNil(referrerId)) {
          return Promise.resolve(dispatch(receiveWSEditEvent(object)));
        }
        if (isMeLeaveEvent(object, identifierId)) {
          return onRemoveBox(boxId).then(() => enqueueSnackbar(leaveSuccess, { variant: 'success' }));
        }
        if (isMeKickEvent(object, identifierId)) {
          return onRemoveBox(boxId).then((box) => onKickSuccess(box));
        }
        if (isMeJoinEvent(object, identifierId)) {
          return batch(() => {
            dispatch(updateEntities(
              [{ id: boxId, changes: { hasAccess: true, isMember: true } }],
              BoxesSchema,
            ));
            dispatch(addBoxEvent(boxId, object));
          });
        }
        const isMyEvent = isMeEvent(object, identifierId);
        return Promise.resolve(dispatch(addBoxEvent(boxId, object, isMyEvent)));
      }
      log(`Receive unknown WS type: ${type}`);
      return Promise.resolve();
    },
    [identifierId, leaveSuccess, onRemoveBox, onDeleteSuccess,
      dispatch, enqueueSnackbar, onKickSuccess],
  );
};
