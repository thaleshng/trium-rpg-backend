import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

app.listen(Number(env.PORT), () => {
    logger.info({ port: env.PORT }, 'HTTP server running');
});
