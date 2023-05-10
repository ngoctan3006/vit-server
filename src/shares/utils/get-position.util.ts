import { Position } from '@prisma/client';
import { removeAccents } from './';

export const getPosition = (position?: string): Position => {
  if (!position) return Position.MEMBER;
  const rmAc = removeAccents(position).toLowerCase();
  switch (rmAc) {
    case 'doi truong':
      return Position.DOI_TRUONG;
    case 'doi pho':
      return Position.DOI_PHO;
    case 'truong mang phong trao':
      return Position.TRUONG_PHONG_TRAO;
    case 'truong mang hanh chinh':
      return Position.TRUONG_HANH_CHINH;
    case 'truong mang hau can':
      return Position.TRUONG_HAU_CAN;
    case 'truong mang truyen thong':
      return Position.TRUONG_TRUYEN_THONG;
    case 'pho mang phong trao':
      return Position.PHO_PHONG_TRAO;
    case 'pho mang hanh chinh':
      return Position.PHO_HANH_CHINH;
    case 'pho mang hau can':
      return Position.PHO_HAU_CAN;
    case 'pho mang truyen thong':
      return Position.PHO_TRUYEN_THONG;
    case 'chu nhiem vit dancer':
      return Position.CN_DANCER;
    case 'chu nhiem vit media':
      return Position.CN_MEDIA;
    case 'chu nhiem vit guitar':
      return Position.CN_GUITAR;
    case 'nhom truong':
      return Position.NHOM_TRUONG;
    case 'nhom pho':
      return Position.NHOM_PHO;
    default:
      return Position.MEMBER;
  }
};
