// Group apis authorization
export const CAN_CREATE_GROUP = ['admin', 'boss', 'group_chief', 'group_vice'];
export const CAN_UPDATE_GROUP = ['admin', 'boss', 'group_chief', 'group_vice'];
export const CAN_DELETE_GROUP = ['admin', 'boss', 'group_chief', 'group_vice'];

// Activity apis authorization
export const CAN_CREATE_ACTIVITY = ['admin', 'boss'];
export const CAN_UPDATE_ACTIVITY = ['admin', 'boss'];
export const CAN_DELETE_ACTIVITY = ['admin', 'boss'];

// Event apis authorization
export const CAN_CREATE_EVENT = ['admin', 'boss'];
export const CAN_UPDATE_EVENT = ['admin', 'boss'];
export const CAN_DELETE_EVENT = ['admin', 'boss'];

// Club apis authorization
export const CAN_CREATE_CLUB = ['admin', 'boss'];
export const CAN_UPDATE_CLUB = ['admin', 'boss'];
export const CAN_DELETE_CLUB = ['admin', 'boss'];

// Department apis authorization
export const CAN_CREATE_DEPARTMENT = ['admin', 'boss'];
export const CAN_UPDATE_DEPARTMENT = ['admin', 'boss'];
export const CAN_DELETE_DEPARTMENT = ['admin', 'boss'];

// Error message
export const NOT_AUTHORIZED = {
  success: false,
  message: 'Not authorized',
};

export const ADMIN = 'admin';
