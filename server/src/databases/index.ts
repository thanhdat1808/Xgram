import { DB_HOST, DB_PORT, DB_DATABASE } from '@config';

export const dbConnection = {
  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    dbName: `${DB_DATABASE}`,
    useUnifiedTopology: true,
  },
};
