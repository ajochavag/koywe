import 'dotenv/config';

const env = (key: string) => {
	return process.env[key];
};

export default {
	PORT: env('PORT') ?? 3000,
	ENVIRONMENT: env('ENVIRONMENT') ?? 'DEVELOP',
	DATABASE: {
		CONNECTION:
			env('MONGO_URL') ?? 'mongodb://localhost:27017/koywe-challenge',
	},
	ACCESS_TOKEN: {
		JWT_SECRET: env('JWT_SECRET') ?? '',
		EXPIRES_IN: env('ACCESS_TOKEN_EXPIRES_IN') ?? '24h',
	},
	CRYPTO_MKT: {
		EXCHANGE_BASE_URL: env('EXCHANGE_CRYPTO_MKT_BASE_URL') ?? '',
	},
	QUOTE: {
		TTL: env('QUOTE_TTL') ?? '300',
	}
};
