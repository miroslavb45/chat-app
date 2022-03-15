import { UserRepository } from '@chat-app/entity-repository';
import { Controller, Post, Req, UnprocessableEntityException } from '@nestjs/common';
import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils';
import { RegisterUserRequestDto } from './dtos/request/register-user-request.dto';


@Controller('register')
export class RegisterController {
  public constructor(private readonly userRepository: UserRepository) { }

  @Post()
  public async registerAction(@Req() request: RegisterUserRequestDto): Promise<void> {

    if (!request.user.email) {
      throw new UnprocessableEntityException('No email provided in the payload.');
    }

    const dbUser = await this.userRepository.findByEmail(request.user.email);

    if (!isNullOrUndefined(dbUser)) {
      throw new UnprocessableEntityException('EmailAlreadyTaken');
    }

    await this.userRepository.create({
      email: request.user.email
    });


    console.log('New user created successfully.');
  }

}
