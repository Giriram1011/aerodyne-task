// shared.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
    isGlobal: true, 
    envFilePath: ['.env'],
  }),
    MongooseModule.forRoot(
    `${process.env.MONGODB_URI}`
    )
  ],
  exports: [],
})
export class SharedModule {}
