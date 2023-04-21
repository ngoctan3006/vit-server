import { removeAccents } from './remove-accents.util';

export const generateUsername = (fullname: string): string => {
  const nameArray = removeAccents(fullname).toLowerCase().split(' ');
  return `${nameArray.slice(-1)[0]}.${nameArray
    .slice(0, -1)
    .map((name) => name[0])
    .join('')}`;
};
