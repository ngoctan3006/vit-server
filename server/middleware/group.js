import {
  CAN_CREATE_GROUP,
  CAN_UPDATE_GROUP,
  CAN_DELETE_GROUP,
  NOT_AUTHORIZED,
} from '../common/constants.js';

export const authorizeCreateGroup = (req, res, next) => {
  const canCreateGroup = req.positions.checkIntersection(CAN_CREATE_GROUP);
  if (canCreateGroup) next();
  else {
    res.status(403).json(NOT_AUTHORIZED);
  }
};

export const authorizeUpdateGroup = (req, res, next) => {
  const canUpdateGroup = req.positions.checkIntersection(CAN_UPDATE_GROUP);
  if (canUpdateGroup) next();
  else {
    res.status(403).json(NOT_AUTHORIZED);
  }
};

export const authorizeDeleteGroup = (req, res, next) => {
  const canDeleteGroup = req.positions.checkIntersection(CAN_DELETE_GROUP);
  if (canDeleteGroup) next();
  else {
    res.status(403).json(NOT_AUTHORIZED);
  }
};
