import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class EventService {
  constructor(private readonly userService: UserService) {}

  // async create(data: CreateEventDto): Promise<ResponseDto<Event>> {
  //   const { start_date, end_date, ...rest } = data;
  //   return {
  //     data: await this.prisma.event.create({
  //       data: {
  //         ...rest,
  //         start_date: new Date(start_date),
  //         end_date: new Date(end_date),
  //       },
  //     }),
  //   };
  // }

  // async findAll(page: number, limit: number): Promise<ResponseDto<Event[]>> {
  //   if (isNaN(page) || isNaN(limit))
  //     throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

  //   return {
  //     data: await this.prisma.event.findMany({
  //       where: { deleted_at: null },
  //       skip: (page - 1) * limit,
  //       take: limit,
  //     }),
  //     metadata: {
  //       totalPage: Math.ceil(
  //         (await this.prisma.event.count({ where: { deleted_at: null } })) /
  //           limit
  //       ),
  //     },
  //   };
  // }

  // async findAllDeleted(
  //   page: number,
  //   limit: number
  // ): Promise<ResponseDto<Event[]>> {
  //   if (isNaN(page) || isNaN(limit))
  //     throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

  //   return {
  //     data: await this.prisma.event.findMany({
  //       where: {
  //         deleted_at: { not: null },
  //       },
  //       skip: (page - 1) * limit,
  //       take: limit,
  //       orderBy: {
  //         deleted_at: 'desc',
  //       },
  //     }),
  //     metadata: {
  //       totalPage: Math.ceil(
  //         (await this.prisma.event.count({
  //           where: {
  //             deleted_at: { not: null },
  //           },
  //         })) / limit
  //       ),
  //     },
  //   };
  // }

  // async findOne(id: number): Promise<ResponseDto<Event>> {
  //   const event = await this.prisma.event.findUnique({ where: { id } });
  //   if (!event || event.deleted_at)
  //     throw new HttpException(httpErrors.EVENT_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   return { data: event };
  // }

  // async findOneDeleted(id: number): Promise<ResponseDto<Event>> {
  //   const event = await this.prisma.event.findUnique({ where: { id } });
  //   if (!event || !event.deleted_at)
  //     throw new HttpException(httpErrors.EVENT_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   return { data: event };
  // }

  // async update(id: number, data: UpdateEventDto): Promise<ResponseDto<Event>> {
  //   await this.findOne(id);
  //   const { start_date, end_date, ...rest } = data;
  //   const { data: event } = await this.findOne(id);

  //   await this.prisma.event.update({
  //     where: { id },
  //     data: {
  //       ...rest,
  //       start_date: start_date ? new Date(start_date) : event.start_date,
  //       end_date: end_date ? new Date(end_date) : event.end_date,
  //     },
  //   });

  //   return await this.findOne(id);
  // }

  // async softDelete(id: number): Promise<ResponseDto<MessageDto>> {
  //   await this.findOne(id);
  //   await this.prisma.event.update({
  //     where: { id },
  //     data: { deleted_at: new Date() },
  //   });

  //   return { data: messageSuccess.EVENT_DELETE };
  // }

  // async restore(id: number): Promise<ResponseDto<Event>> {
  //   await this.findOneDeleted(id);
  //   await this.prisma.event.update({
  //     where: { id },
  //     data: { deleted_at: null },
  //   });

  //   return await this.findOne(id);
  // }

  // async register(
  //   userId: number,
  //   eventId: number
  // ): Promise<ResponseDto<MessageDto>> {
  //   await this.findOne(eventId);
  //   await this.userService.getUserInfoById(userId);
  //   const isRegistered = await this.prisma.userEvent.findUnique({
  //     where: {
  //       user_id_event_id: {
  //         user_id: userId,
  //         event_id: eventId,
  //       },
  //     },
  //   });
  //   if (isRegistered) {
  //     if (isRegistered.status === UserActivityStatus.WITHDRAWN)
  //       await this.prisma.userEvent.update({
  //         where: {
  //           user_id_event_id: {
  //             user_id: userId,
  //             event_id: eventId,
  //           },
  //         },
  //         data: { status: UserActivityStatus.REGISTERED },
  //       });
  //     else
  //       throw new HttpException(
  //         httpErrors.EVENT_REGISTERED,
  //         HttpStatus.BAD_REQUEST
  //       );
  //   } else
  //     await this.prisma.userEvent.create({
  //       data: {
  //         user_id: userId,
  //         event_id: eventId,
  //       },
  //     });

  //   return { data: messageSuccess.EVENT_REGISTER };
  // }

  // async cancelRegister(
  //   userId: number,
  //   eventId: number
  // ): Promise<ResponseDto<MessageDto>> {
  //   await this.findOne(eventId);
  //   await this.userService.getUserInfoById(userId);
  //   const isRegistered = await this.prisma.userEvent.findUnique({
  //     where: {
  //       user_id_event_id: {
  //         user_id: userId,
  //         event_id: eventId,
  //       },
  //     },
  //   });
  //   if (!isRegistered || isRegistered.status === UserActivityStatus.WITHDRAWN)
  //     throw new HttpException(
  //       httpErrors.EVENT_NOT_REGISTERED,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   await this.prisma.userEvent.update({
  //     where: {
  //       user_id_event_id: {
  //         user_id: userId,
  //         event_id: eventId,
  //       },
  //     },
  //     data: { status: UserActivityStatus.WITHDRAWN },
  //   });

  //   return { data: messageSuccess.EVENT_CANCEL };
  // }

  // async approve(data: ApproveDto): Promise<ResponseDto<MessageDto>> {
  //   const { eventId, userId } = data;
  //   await this.findOne(eventId);
  //   await this.userService.getUserInfoById(userId);
  //   const isRegistered = await this.prisma.userEvent.findUnique({
  //     where: {
  //       user_id_event_id: {
  //         user_id: userId,
  //         event_id: eventId,
  //       },
  //     },
  //   });
  //   if (!isRegistered || isRegistered.status === UserActivityStatus.WITHDRAWN)
  //     throw new HttpException(
  //       httpErrors.EVENT_USER_NOT_REGISTERED,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   else if (isRegistered.status === UserActivityStatus.ACCEPTED)
  //     throw new HttpException(
  //       httpErrors.EVENT_ACCEPTED,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   await this.prisma.userEvent.update({
  //     where: {
  //       user_id_event_id: {
  //         user_id: userId,
  //         event_id: eventId,
  //       },
  //     },
  //     data: { status: UserActivityStatus.ACCEPTED },
  //   });

  //   return { data: messageSuccess.EVENT_APPROVE };
  // }
}
