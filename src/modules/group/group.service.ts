import { Injectable } from '@nestjs/common';
import { EventService } from './../event/event.service';

@Injectable()
export class GroupService {
  constructor(private readonly eventService: EventService) {}

  // async create(data: CreateGroupDto): Promise<ResponseDto<Group>> {
  //   return { data: await this.prisma.group.create({ data }) };
  // }

  // async findAll(page: number, limit: number): Promise<ResponseDto<Group[]>> {
  //   if (isNaN(page) || isNaN(limit))
  //     throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

  //   return {
  //     data: await this.prisma.group.findMany({
  //       where: { deleted_at: null },
  //       skip: (page - 1) * limit,
  //       take: limit,
  //       orderBy: {
  //         created_at: 'desc',
  //       },
  //     }),
  //     metadata: {
  //       totalPage: Math.ceil(
  //         (await this.prisma.group.count({
  //           where: { deleted_at: null },
  //         })) / limit
  //       ),
  //     },
  //   };
  // }

  // async findAllDeleted(
  //   page: number,
  //   limit: number
  // ): Promise<ResponseDto<Group[]>> {
  //   if (isNaN(page) || isNaN(limit))
  //     throw new HttpException(httpErrors.QUERY_INVALID, HttpStatus.BAD_REQUEST);

  //   return {
  //     data: await this.prisma.group.findMany({
  //       where: { deleted_at: { not: null } },
  //       skip: (page - 1) * limit,
  //       take: limit,
  //       orderBy: {
  //         deleted_at: 'desc',
  //       },
  //     }),
  //     metadata: {
  //       totalPage: Math.ceil(
  //         (await this.prisma.group.count({
  //           where: { deleted_at: { not: null } },
  //         })) / limit
  //       ),
  //     },
  //   };
  // }

  // async findOne(id: number): Promise<ResponseDto<Group>> {
  //   const group = await this.prisma.group.findUnique({
  //     where: { id },
  //   });
  //   if (!group || group.deleted_at) {
  //     throw new HttpException(httpErrors.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   }
  //   return { data: group };
  // }

  // async findOneDeleted(id: number): Promise<ResponseDto<Group>> {
  //   const group = await this.prisma.group.findUnique({
  //     where: { id },
  //   });
  //   if (!group || !group.deleted_at) {
  //     throw new HttpException(httpErrors.GROUP_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   }
  //   return { data: group };
  // }

  // async update(id: number, data: UpdateGroupDto): Promise<Group> {
  //   await this.findOne(id);
  //   if (data.event_id) await this.eventService.findOne(data.event_id);
  //   return await this.prisma.group.update({ where: { id }, data });
  // }

  // async softRemove(id: number): Promise<ResponseDto<MessageDto>> {
  //   await this.findOne(id);
  //   await this.prisma.group.update({
  //     where: { id },
  //     data: { deleted_at: new Date() },
  //   });
  //   return { data: messageSuccess.GROUP_DELETE };
  // }

  // async restore(id: number): Promise<ResponseDto<Group>> {
  //   await this.findOneDeleted(id);
  //   await this.prisma.group.update({
  //     where: { id },
  //     data: { deleted_at: null },
  //   });
  //   return await this.findOne(id);
  // }
}
