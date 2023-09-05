import { Position } from '@prisma/client';
import { removeAccents } from 'src/shares/utils';

export const getPosition = (position?: string): Position => {
  if (!position) return Position.THANH_VIEN;
  const rmAc = removeAccents(position).toLowerCase();
  switch (rmAc) {
    case 'admin':
      return Position.ADMIN;
    case 'doi truong':
      return Position.DOI_TRUONG;
    case 'doi pho':
      return Position.DOI_PHO;
    case 'mang truong':
      return Position.MANG_TRUONG;
    case 'mang pho':
      return Position.MANG_PHO;
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
    case 'chu nhiem':
      return Position.CHU_NHIEM;
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
    case 'out':
      return Position.OUT;
    case 'leader':
      return Position.LEADER;
    default:
      return Position.THANH_VIEN;
  }
};
