import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '';

export const config = {
  PORT,
  PREFIX,
};
