import {
  CAN_CREATE_EVENT,
  CAN_UPDATE_EVENT,
  CAN_DELETE_EVENT,
  NOT_AUTHORIZED,
} from '../common/constants.js';

export const authorizeViewEvent = (req, res, next) => {
  next();
};

export const authorizeCreateEvent = (req, res, next) => {
  const canCreateEvent = req.positions.checkIntersection(CAN_CREATE_EVENT);
  if (canCreateEvent) next();
  else {
    return res.status(403).json(NOT_AUTHORIZED);
  }
};

export const authorizeUpdateEvent = (req, res, next) => {
  const canUpdateEvent = req.positions.checkIntersection(CAN_UPDATE_EVENT);
  if (canUpdateEvent) next();
  else {
    return res.status(403).json(NOT_AUTHORIZED);
  }
};

export const authorizeDeleteEvent = (req, res, next) => {
  const canDeleteEvent = req.positions.checkIntersection(CAN_DELETE_EVENT);
  if (canDeleteEvent) next();
  else {
    return res.status(403).json(NOT_AUTHORIZED);
  }
};
