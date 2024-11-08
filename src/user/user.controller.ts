// src/user/user.controller.ts

import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('age') age: number,
  ) {
    return this.userService.createUser(name, email, age);
  }

  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }
}
