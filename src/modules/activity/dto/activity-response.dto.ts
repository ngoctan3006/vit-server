import { Activity, ActivityTime } from '@prisma/client';

export type ActivityResponse = Activity & {
  times: Omit<ActivityTime, 'activityId'>[];
};
