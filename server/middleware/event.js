import {
	CAN_CREATE_EVENT,
	CAN_UPDATE_EVENT,
	CAN_DELETE_EVENT
} from './constants.js';

export const authorizeViewEvent = (req, res, next) => {
	next();
};

export const authorizeCreateEvent = (req, res, next) => {
	if (canCreateEvent(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

export const authorizeUpdateEvent = (req, res, next) => {
	if (canUpdateEvent(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

export const authorizeDeleteEvent = (req, res, next) => {
	if (canDeleteEvent(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

function canCreateEvent(positions) {
	return positions.some((element) => {
		return CAN_CREATE_EVENT.includes(element);
	});
}

function canUpdateEvent(positions) {
	return positions.some((element) => {
		return CAN_UPDATE_EVENT.includes(element);
	});
}

function canDeleteEvent(positions) {
	return positions.some((element) => {
		return CAN_DELETE_EVENT.includes(element);
	});
}
