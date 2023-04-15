import { Gender } from '@prisma/client';
import { removeAccents } from './remove-accents.util';

export const getGender = (gender: string) => {
  const result = removeAccents(gender).toLowerCase();
  return result === 'nam'
    ? Gender.MALE
    : result === 'nu'
    ? Gender.FEMALE
    : Gender.OTHER;
};
