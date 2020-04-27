export default {
  mail: {
    email: 'email',
    password:'password',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    rejectUnauthorized: false
  },
  dbConfig: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'database',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
 
  aws: {
    AWS_S3_BUCKET_NAME: 'AWS_S3_BUCKET_NAME',
    Access_Key_ID: 'Access_Key_ID',
    Secret_Access_Key:'Secret_Access_Key',
    cdnUrl: 'cdnUrl'
  }
}
