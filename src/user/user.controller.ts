import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAllUsers(@Req() request: Request) {
    // console.log(request);
    return this.userService.findAllUsers();
  }
}
