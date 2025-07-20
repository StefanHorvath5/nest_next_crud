import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { SafeUser } from 'src/auth/auth.service';
import { Request as ExpressRequest } from 'express';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as SafeUser;

    const targetItem = await this.itemsService.findOne(id);
    if (user.id !== targetItem.createdBy.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Not allowed to edit this user');
    }
    return this.itemsService.update(+id, updateItemDto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req: ExpressRequest) {
    const user = req.user as SafeUser;

    const targetItem = await this.itemsService.findOne(id);
    if (user.id !== targetItem.createdBy.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Not allowed to edit this user');
    }
    return this.itemsService.remove(id);
  }
}
