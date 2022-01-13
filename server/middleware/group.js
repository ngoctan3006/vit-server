import {
	CAN_VIEW_GROUP,
	CAN_CREATE_GROUP,
	CAN_UPDATE_GROUP,
	CAN_DELETE_GROUP
} from './constants.js';

export const authorizeViewGroup = (req, res, next) => {
	if (canViewGroup(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

export const authorizeCreateGroup = (req, res, next) => {
	if (canCreateGroup(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

export const authorizeUpdateGroup = (req, res, next) => {
	if (canUpdateGroup(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

export const authorizeDeleteGroup = (req, res, next) => {
	if (canDeleteGroup(req.positions)) next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

function canViewGroup(positions) {
	return positions.some((element) => {
		return CAN_VIEW_GROUP.includes(element);
	});
}

function canCreateGroup(positions) {
	return positions.some((element) => {
		return CAN_CREATE_GROUP.includes(element);
	});
}

function canUpdateGroup(positions) {
	return positions.some((element) => {
		return CAN_UPDATE_GROUP.includes(element);
	});
}

function canDeleteGroup(positions) {
	return positions.some((element) => {
		return CAN_DELETE_GROUP.includes(element);
	});
}
