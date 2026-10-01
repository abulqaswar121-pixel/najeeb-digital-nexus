import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`[ndh-server] API listening on http://0.0.0.0:${env.PORT}`);
});
