const TABLE_NAME = process.env.TABLE_NAME;

if (!TABLE_NAME) {
  throw new Error('Missing table name');
}

export const table = TABLE_NAME;
