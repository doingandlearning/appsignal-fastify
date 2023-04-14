const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("./db"));
fastify.register(require("./routes"));

// fastify.get("/", async (request, reply) => {
//   return { hello: "me" };
// });

// fastify.get("/error", async () => {
//   throw new Error("This is a test error.");
// });

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
