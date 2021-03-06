const dbConfig = {
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      migrations: [`dist/src/migrations/**/*.js`],
      entities: [__dirname + '/**/*.entity.js'],
    });
    break;

  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      migrations: [`src/migrations/**/*.ts`],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrations: [`dist/src/migrations/**/*.js`],
      entities: [__dirname + '/**/*.entity.js'],
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    break;

  default:
    throw new Error('Unknown environment');
}

module.exports = dbConfig;
