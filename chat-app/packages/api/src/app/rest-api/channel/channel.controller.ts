import { Channel } from '@chat-app/dbal';
import { ChannelRepository, WorkspaceRepository } from '@chat-app/entity-repository';
import { RequestDto } from '@chat-app/shared/auth';
import { ConflictException, Controller, Get, HttpCode, NotFoundException, Post, Query, Req, UnprocessableEntityException, UseInterceptors } from '@nestjs/common';
import { Types } from 'mongoose';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';
import { ChannelsResponseDto } from './dtos/channels-response.dto';
import { GetChannelResponseDto } from './dtos/get-channel-response.dto';

@UseInterceptors(ErrorInterceptor)
@Controller()
export class ChannelController {
  public constructor(private readonly channelRepository: ChannelRepository, private readonly workspaceRepository: WorkspaceRepository) { }

  @Get('channels')
  @HttpCode(200)
  public async getChannelsAction(@Req() request: RequestDto, @Query('workspace') workspace: string): Promise<ChannelsResponseDto> {


    if (!workspace) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }

    // Check if user is in the workspace
    if (!request.dbUser.workspaces.map(ws => ws.toString()).includes(workspace)) {
      throw new UnprocessableEntityException('User is not joined to the given workspace.');
    }


    const channels = await this.channelRepository.getWorkspaceChannels(new Types.ObjectId(workspace));

    return { channels: channels.map(channel => ({ id: channel._id, name: channel.name })) };
  }

  @Get('joinedChannels')
  @HttpCode(200)
  public async getJoinedChannelsAction(@Req() request: RequestDto, @Query('workspace') workspace: string): Promise<ChannelsResponseDto> {


    if (!workspace) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }

    // Check if user is in the workspace
    if (!request.dbUser.workspaces.map(ws => ws.toString()).includes(workspace)) {
      throw new UnprocessableEntityException('User is not joined to the given workspace.');
    }

    const workspaceUser = await this.workspaceRepository.getWorkspaceUser(request.dbUser._id, new Types.ObjectId(workspace));

    if (workspaceUser) {
      return { channels: workspaceUser.joinedChannels };
    }

    throw new Error('No workspace user found.');
  }

  @Post('channel')
  @HttpCode(200)
  public async newChannelAction(@Req() request: RequestDto, @Query('name') name: string, @Query('workspace') workspace: string): Promise<Partial<Channel>> {
    // try {
    if (!name) {
      throw new UnprocessableEntityException('No channel name provided in the payload.');
    }

    if (!workspace) {
      throw new UnprocessableEntityException('No workspace id provided in the payload.');
    }

    const dbWorkspace = await this.workspaceRepository.findById(workspace);


    if (!dbWorkspace) {
      throw new NotFoundException(`Workspace named ${name} doesn't exists.`);
    }

    const dbChannels = await this.channelRepository.getWorkspaceChannels(dbWorkspace._id);

    if (dbChannels.map(item => item.name.toLowerCase()).includes(name.toLowerCase())) {
      throw new ConflictException('Channel already exists');
    }

    const channel = await this.channelRepository.create({
      name: name.toLowerCase(),
      workspace: dbWorkspace._id
    });


    if (!channel) {
      throw new Error('Channel creation failed.')
    }

    await this.workspaceRepository.updateById(dbWorkspace._id, {
      channels: [...dbWorkspace.channels, channel._id]
    })

    return { name: channel.name.toLowerCase(), _id: channel._id };
  }

  // @Post('workspace/select')
  // @HttpCode(200)
  // public async selectWorkspaceAction(@Req() request: RequestDto, @Query('id') id: string): Promise<Partial<WorkspaceResponseDto>> {

  //   if (!id) {
  //     throw new UnprocessableEntityException('No workspace id provided in the payload.');
  //   }
  //   const dbWorkspace = await this.workspaceRepository.findById(id);

  //   if (!dbWorkspace) {
  //     throw new NotFoundException(`Workspace named ${dbWorkspace.name} doesn't exists.`);
  //   }

  //   try {
  //     await this.userService.selectWorkspace(request.dbUser, dbWorkspace._id);
  //     return { id: dbWorkspace._id.toString(), name: dbWorkspace.name }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // @Post('workspace/unselect')
  // @HttpCode(200)
  // public async unselectWorkspaceAction(@Req() request: RequestDto): Promise<void> {

  //   try {
  //     await this.userService.unselectWorkspace(request.dbUser);
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  @Get('channel')
  @HttpCode(200)
  public async getChannelAction(@Req() request: RequestDto, @Query('id') id: string): Promise<GetChannelResponseDto> {

    if (!id) {
      throw new UnprocessableEntityException('No channel id provided in the payload.');
    }

    const channel = await this.channelRepository.findById(new Types.ObjectId(id));

    const messages = await this.channelRepository.getChannelMessages(channel._id);

    if (!channel) {
      throw new ConflictException(`Channel doesn't exist.`);
    }


    return { name: channel.name, messages: messages, joinedUserNumber: channel.joinedUsers.length, id: channel._id };
  }

  @Post('renameChannel')
  @HttpCode(200)
  public async renameChannelAction(@Req() request: RequestDto, @Query('name') name: string, @Query('id') channelId: string): Promise<Partial<Channel>> {
    // try {
    if (!name) {
      throw new UnprocessableEntityException('No channel name provided in the payload.');
    }

    if (!channelId) {
      throw new UnprocessableEntityException('No channel id provided in the payload.');
    }

    const dbChannel = await this.channelRepository.findById(new Types.ObjectId(channelId));


    if (!dbChannel) {
      throw new NotFoundException(`Channel doesn't exists.`);
    }


    if (dbChannel.name.toLowerCase() === name.toLowerCase()) {
      throw new ConflictException(`Channel named ${name} already exists.`);
    }

    await this.channelRepository.updateById(dbChannel._id,
      { name: name.toLowerCase() }
    )

    return { name: name.toLowerCase(), _id: dbChannel._id };
  }

  @Post('deleteChannel')
  @HttpCode(200)
  public async deleteChannelAction(@Req() request: RequestDto, @Query('id') channelId: string): Promise<Partial<Channel>> {
    if (!channelId) {
      throw new UnprocessableEntityException('No channel id provided in the payload.');
    }

    const dbChannel = await this.channelRepository.findById(new Types.ObjectId(channelId));


    if (!dbChannel) {
      throw new NotFoundException(`Channel doesn't exists.`);
    }

    await this.channelRepository.deleteChannel(dbChannel._id.toString());


    return { _id: dbChannel._id };
  }

}
