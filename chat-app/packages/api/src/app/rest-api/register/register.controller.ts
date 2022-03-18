import { UserRepository } from '@chat-app/entity-repository';
import { Controller, Post, Query, UnprocessableEntityException } from '@nestjs/common';
import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils';
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
