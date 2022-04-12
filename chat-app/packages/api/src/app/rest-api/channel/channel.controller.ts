import { Channel } from '@chat-app/dbal';
import { ChannelRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { AuthorizationInterceptor, RequestDto } from '@chat-app/shared/auth';
import { ConflictException, Controller, Get, HttpCode, NotFoundException, Post, Query, Req, UnauthorizedException, UnprocessableEntityException, UseInterceptors } from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '../../constants/roles.enum';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';
import { ChannelsResponseDto } from './dtos/channels-response.dto';
import { GetChannelResponseDto } from './dtos/get-channel-response.dto';

@UseInterceptors(ErrorInterceptor)
@Controller()
export class ChannelController {
  public constructor(private readonly channelRepository: ChannelRepository, private readonly workspaceRepository: WorkspaceRepository) { }

  @Get('channels')
  @HttpCode(200)
  public async getChannelsAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<ChannelsResponseDto> {


    if (!entityId) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }

    // Check if user is in the workspace
    if (!request.dbUser.workspaces.map(ws => ws.toString()).includes(entityId)) {
      throw new UnprocessableEntityException('User is not joined to the given workspace.');
    }


    const channels = await this.channelRepository.getWorkspaceChannels(new Types.ObjectId(entityId));

    return { channels: channels.map(channel => ({ id: channel._id, name: channel.name })) };
  }

  @Get('joinedChannels')
  @HttpCode(200)
  public async getJoinedChannelsAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<ChannelsResponseDto> {


    if (!entityId) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }

    // Check if user is in the workspace
    if (!request.dbUser.workspaces.map(ws => ws.toString()).includes(entityId)) {
      throw new UnprocessableEntityException('User is not joined to the given workspace.');
    }

    const workspaceUser = await this.workspaceRepository.getWorkspaceUser(request.dbUser._id, new Types.ObjectId(entityId));

    if (workspaceUser) {
      return { channels: workspaceUser.joinedChannels };
    }

    throw new Error('No workspace user found.');
  }

  @UseInterceptors(AuthorizationInterceptor)
  @Post('channel')
  @HttpCode(200)
  public async newChannelAction(@Req() request: RequestDto, @Query('name') name: string, @Query('entityId') entityId: string): Promise<Partial<Channel>> {

    if (!name) {
      throw new UnprocessableEntityException('No channel name provided in the payload.');
    }

    if (!entityId) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }

    const dbWorkspace = await this.workspaceRepository.findById(entityId);


    if (!dbWorkspace) {
      throw new NotFoundException(`Workspace named ${name} doesn't exists.`);
    }

    const dbChannels = await this.channelRepository.getWorkspaceChannels(dbWorkspace._id);

    if (dbChannels.map(item => item.name.toLowerCase()).includes(name.toLowerCase())) {
      throw new ConflictException('Channel already exists');
    }

    const channel = await this.channelRepository.create({
      name: name.toLowerCase(),
      workspace: dbWorkspace._id,
      author: request.workspaceUser._id
    });


    if (!channel) {
      throw new Error('Channel creation failed.')
    }

    await this.workspaceRepository.updateById(dbWorkspace._id, {
      channels: [...dbWorkspace.channels, channel._id]
    })

    return { name: channel.name.toLowerCase(), _id: channel._id };
  }

  @Get('channel')
  @HttpCode(200)
  public async getChannelAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<GetChannelResponseDto> {

    if (!entityId) {
      throw new UnprocessableEntityException('No channel id provided in the payload.');
    }

    const channel = await this.channelRepository.findById(new Types.ObjectId(entityId));

    const messages = await this.channelRepository.getChannelMessages(channel._id);

    if (!channel) {
      throw new ConflictException(`Channel doesn't exist.`);
    }

    return { name: channel.name, messages: messages, joinedUserNumber: channel.joinedUsers.length, id: channel._id, author: channel.author?._id };
  }

  @UseInterceptors(AuthorizationInterceptor)
  @Post('renameChannel')
  @HttpCode(200)
  public async renameChannelAction(@Req() request: RequestDto, @Query('name') name: string, @Query('entityId') entityId: string): Promise<Partial<Channel>> {
    if (!name) {
      throw new UnprocessableEntityException('No channel name provided in the payload.');
    }

    if (!entityId) {
      throw new UnprocessableEntityException('No channel id provided in the payload.');
    }

    const dbChannel = await this.channelRepository.findById(new Types.ObjectId(entityId));


    if (!dbChannel) {
      throw new NotFoundException(`Channel doesn't exists.`);
    }

    if (request.workspaceUser.role === Roles.Admin || dbChannel.author.toString() === request.workspaceUser._id.toString()) {
      if (dbChannel.name.toLowerCase() === name.toLowerCase()) {
        throw new ConflictException(`Channel named ${name} already exists.`);
      }

      await this.channelRepository.updateById(dbChannel._id,
        { name: name.toLowerCase() }
      )

      return { name: name.toLowerCase(), _id: dbChannel._id };
    } else {
      throw new UnauthorizedException('Not authorized.')
    }

  }

  @UseInterceptors(AuthorizationInterceptor)
  @Post('deleteChannel')
  @HttpCode(200)
  public async deleteChannelAction(@Req() request: RequestDto, @Query('entityId') entityId: string): Promise<Partial<Channel>> {
    if (!entityId) {
      throw new UnprocessableEntityException('No channel id provided in the payload.');
    }

    const dbChannel = await this.channelRepository.findById(new Types.ObjectId(entityId));


    if (request.workspaceUser.role === Roles.Admin || dbChannel.author.toString() === request.workspaceUser._id.toString()) {
      if (!dbChannel) {
        throw new NotFoundException(`Channel doesn't exists.`);
      }

      await this.channelRepository.deleteChannel(dbChannel._id.toString());

      return { _id: dbChannel._id };
    } else {
      throw new UnauthorizedException('Not authorized.')
    }

  }

}
