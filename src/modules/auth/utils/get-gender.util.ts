import { Gender } from 'src/shares/enums';
import { removeAccents } from '../../../shares/utils';

export const getGender = (gender?: string): Gender => {
  if (!gender) return Gender.OTHER;
  const result = removeAccents(gender).toLowerCase();
  return result === 'nam'
    ? Gender.MALE
    : result === 'nu'
    ? Gender.FEMALE
    : Gender.OTHER;
};
