import { Position } from '@prisma/client';
import { removeAccents } from './remove-accents.util';

export const getPosition = (position: string): Position => {
  const rmAc = removeAccents(position).toLowerCase();
  switch (rmAc) {
    case 'doi truong':
      return Position.CHIEF;
    case 'doi pho':
      return Position.VICE;
    case 'truong mang phong trao':
    case 'truong mang hanh chinh':
    case 'truong mang hau can':
    case 'truong mang truyen thong':
      return Position.DEPARMENT_CHIEF;
    case 'pho mang phong trao':
    case 'pho mang hanh chinh':
    case 'pho mang hau can':
    case 'pho mang truyen thong':
      return Position.DEPARMENT_CHIEF;
    case 'chu nhiem vit dancer':
    case 'chu nhiem vit media':
    case 'chu nhiem vit guitar':
      return Position.CLUB_CHIEF;
    default:
      return Position.MEMBER;
  }
};
