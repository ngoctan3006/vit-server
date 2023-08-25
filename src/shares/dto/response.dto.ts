export class ResponseDto<T> {
  data: T;
  pagination?: {
    totalPage?: number;
  };
}
