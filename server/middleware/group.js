export const authorizeViewGroup = (req, res, next) => {
	console.log(req);
	if (canViewGroup(req.positions, ['admin', 'boss', 'group_chief', 'group_vice']))
		next();
	else {
		return res.status(403).json({
			success: false,
			message: 'Not authorized'
		});
	}
};

function canViewGroup(positions, authorized) {
    return positions.some(element => {
        return authorized.includes(element);
    })
}
