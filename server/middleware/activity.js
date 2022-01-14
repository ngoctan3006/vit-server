import {
	CAN_CREATE_ACTIVITY,
	CAN_UPDATE_ACTIVITY,
	CAN_DELETE_ACTIVITY
} from './constants.js';

export const authorizeViewActivity = (req, res, next) => {
	next();
};

export const authorizeCreateActivity = (req, res, next) => {
	if (canCreateActivity(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

export const authorizeUpdateActivity = (req, res, next) => {
	if (canUpdateActivity(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

export const authorizeDeleteActivity = (req, res, next) => {
	if (canDeleteActivity(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

function canCreateActivity(positions) {
	return positions.some((element) => {
		return CAN_CREATE_ACTIVITY.includes(element);
	});
}

function canUpdateActivity(positions) {
	return positions.some((element) => {
		return CAN_UPDATE_ACTIVITY.includes(element);
	});
}

function canDeleteActivity(positions) {
	return positions.some((element) => {
		return CAN_DELETE_ACTIVITY.includes(element);
	});
}
