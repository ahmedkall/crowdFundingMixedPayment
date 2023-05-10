declare namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY: string;
      STRIPE_SECRET_KEY: string;
      DB_CONN_STRING: string;
      DB_NAME: string;
      DONATIONS_COLLECTION_NAME: string;
    }
  }