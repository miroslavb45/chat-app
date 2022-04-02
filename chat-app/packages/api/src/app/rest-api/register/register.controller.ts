import { UserRepository } from '@chat-app/entity-repository';
import { isNullOrUndefined } from '@chat-app/utils';
import { Controller, Post, Query, UnprocessableEntityException } from '@nestjs/common';
@Controller('register')
export class RegisterController {
  public constructor(private readonly userRepository: UserRepository) { }

  @Post()
  public async registerAction(@Query('email') email: string): Promise<void> {
    if (!email) {
      throw new UnprocessableEntityException('No email provided in the payload.');
    }

    const dbUser = await this.userRepository.findByEmail(email);

    if (!isNullOrUndefined(dbUser)) {
      throw new UnprocessableEntityException('EmailAlreadyTaken');
    }

    await this.userRepository.create({
      email: email
    });

    console.log(`[${email}] New user created successfully.`);
  }

}
