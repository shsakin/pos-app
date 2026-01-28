import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    // Validate stock availability for all items first
    for (const item of createSaleDto.saleItems) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.stock_quantity}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of createSaleDto.saleItems) {
      totalAmount += parseFloat(item.price.toString()) * item.quantity;
    }

    // Create sale with items and deduct stock in a transaction
    const sale = await this.prisma.sale.create({
      data: {
        totalAmount: totalAmount.toString(),
        saleItems: {
          create: createSaleDto.saleItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price.toString(),
            subtotal: (parseFloat(item.price.toString()) * item.quantity).toString(),
          })),
        },
      },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Deduct stock for each product
    for (const item of createSaleDto.saleItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock_quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return sale;
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
