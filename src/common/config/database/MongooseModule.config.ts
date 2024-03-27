import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

export const mongoModuleOptions = {
  useFactory: async (): Promise<MongooseModuleOptions> => ({
    uri: process.env.MONGODB_URI,
    connectionFactory: (connection) => {
      Logger.log('✅ Connected to MongoDB', 'MongooseModule');
      return connection;
    },
  }),
};
