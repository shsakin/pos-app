import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        sku: createProductDto.sku,
        price: createProductDto.price.toString(),
        stock_quantity: createProductDto.stock_quantity,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const data: any = {};
    if (updateProductDto.name) data.name = updateProductDto.name;
    if (updateProductDto.sku) data.sku = updateProductDto.sku;
    if (updateProductDto.price !== undefined) data.price = updateProductDto.price.toString();
    if (updateProductDto.stock_quantity !== undefined) data.stock_quantity = updateProductDto.stock_quantity;

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
