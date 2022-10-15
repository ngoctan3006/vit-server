import {
  CAN_CREATE_ACTIVITY,
  CAN_UPDATE_ACTIVITY,
  CAN_DELETE_ACTIVITY,
  NOT_AUTHORIZED,
} from '../common/constants.js';

export const authorizeViewActivity = (req, res, next) => {
  next();
};

export const authorizeCreateActivity = (req, res, next) => {
  const canCreateActivity =
    req.positions.checkIntersection(CAN_CREATE_ACTIVITY);
  if (canCreateActivity) next();
  else {
    return res.status(403).json(NOT_AUTHORIZED);
  }
};

export const authorizeUpdateActivity = (req, res, next) => {
  const canUpdateActivity =
    req.positions.checkIntersection(CAN_UPDATE_ACTIVITY);
  if (canUpdateActivity) next();
  else {
    return res.status(403).json(NOT_AUTHORIZED);
  }
};

export const authorizeDeleteActivity = (req, res, next) => {
  const canDeleteActivity =
    req.positions.checkIntersection(CAN_DELETE_ACTIVITY);
  if (canDeleteActivity) next();
  else {
    return res.status(403).json(NOT_AUTHORIZED);
  }
};
