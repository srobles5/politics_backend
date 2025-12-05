import morgan from 'morgan';
import { Request, Response } from 'express';

export const logger = morgan('combined', {
  stream: {
    write: (message: string) => {
      console.log(message.trim());
    },
  },
});

