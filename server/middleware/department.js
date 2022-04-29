import {
    CAN_CREATE_DEPARTMENT,
    CAN_DELETE_DEPARTMENT,
    CAN_UPDATE_DEPARTMENT,
    NOT_AUTHORIZED
} from '../common/constants.js';

export const authorizeCreateDepartment = (req, res, next) => {
    const canCreateDepartment = req.positions.checkIntersection(
        CAN_CREATE_DEPARTMENT
    );
    if (canCreateDepartment) next();
    else {
        res.status(403).json(NOT_AUTHORIZED);
    }
};

export const authorizeUpdateDepartment = (req, res, next) => {
    const canUpdateDepartment = req.positions.checkIntersection(
        CAN_UPDATE_DEPARTMENT
    );
    if (canUpdateDepartment) next();
    else {
        res.status(403).json(NOT_AUTHORIZED);
    }
};

export const authorizeDeleteDepartment = (req, res, next) => {
    const canDeleteDepartment = req.positions.checkIntersection(
        CAN_DELETE_DEPARTMENT
    );
    if (canDeleteDepartment) next();
    else {
        res.status(403).json(NOT_AUTHORIZED);
    }
};
