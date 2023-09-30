import { Gender } from '@prisma/client';
import { removeAccents } from 'src/shares/utils';

export const getGender = (gender?: string): Gender => {
  if (!gender) return Gender.OTHER;
  const result = removeAccents(gender).toLowerCase();
  return result === 'nam'
    ? Gender.MALE
    : result === 'nu'
    ? Gender.FEMALE
    : Gender.OTHER;
};
