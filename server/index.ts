import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

app.listen(env.PORT, env.HOST, () => {
  console.log(`[ndh-server] API listening on http://${env.HOST}:${env.PORT}`);
});
