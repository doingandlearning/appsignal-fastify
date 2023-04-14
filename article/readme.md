In today's fast-paced digital world, developers seek solutions that can not only deliver high-performance web applications but also ensure seamless error tracking and monitoring.

Fastify is a cutting-edge web framework for Node.js, designed to offer exceptional speed and efficiency. With its extensible plugin system, support for asynchronous programming and focus on minimalism, it is an ideal choice for backend developers developing Node.js applications.

But, even the most performant web applications can encounter issues that are difficult to debug without the proper tools in place. Error tracking becomes crucial in maintaining an application's reliability and overall user experience.

To address this need, this article will explore how we can use AppSignal in our Fastify applications. This is a robust error tracking and performance monitoring tool that can provide developers with valuable insights into their applicaton's behaviour. By integrating Fastify with AppSignal, developers can effectively keep their applications in tip-top shape.

By the end of this article, you'll be well-equipped to harness the potential of Fastify with AppSignal, enhancing your ability to quickly fix bugs and identify performance bottlenecks.

## Getting Started with Fastify and AppSignal

Before we dive into the installation, make sure you have Node installed and a code editor of your preference. Ideally, you should be running the latest LTS of Node (which at the time of writing is v18) but if you're stuck on an earlier version, the minimum requirement is v10.

In your terminal, move to a new directory, start a new project and add Fastify as a dependency:

```bash
cd my_project
npm init -y
npm install fastify
```

Now, you can add the code to stand-up a very simple server. This has two routes, one that returns a response and one that throws an error. I've called mine `app.js`:

```javascript
const fastify = require("fastify")({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "me" };
});

fastify.get("/error", async () => {
  throw new Error("This is a test error.");
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
```

This can be run by using Node directly with `node app.js` or by updating your `package.json`. We'll do that in a moment so hold off there!

It's time to set up your AppSignal account. Navigate to the AppSignal website and click on `Start free trial`. Here you can sign up using username and password or by linking AppSignal to your GitHub account. You don't need to provide any credit card details while you are trying out the service.

Once you've signed up and logged in, you'll be brought to the dashboard. Click on the `Add app` button on the top right, select `Node.js` and follow the instructions laid out.

First, we'll run `npx @appsignal/cli install` from the directory our project lives in. This will use the CLI tool to download and configure the AppSignal dependencies.

During the installation, you'll be asked for the push api key which you'll see listed in step 2 of the instructions. Paste that in to the terminal when asked and then name your app. Finally, save the options in a configuration file and allow the installation to finish.

When finished installing, the CLI will print the run command to the terminal. Now we can update our `package.json` with this line in the scripts block:

```json
"start": "node --require './appsignal.cjs' index.js"
```

Back in the terminal, we can start up our server with AppSignal by running `npm run start`.


## Integrating Fastify with AppSignal
Excitingly, for normal instrumentation of our Node application, we've already finished. Fastify is one of many integrations that are fully configured by the CLI tool we used above. 

With the Fastify integration, AppSignal receives a child span representing the execution time of each component involved during a web request. This feature provides valuable insights into the performance of individual components, helping developers identify potential bottlenecks or areas that require optimization.

The integration utilizes the request route as the action name, allowing for easy identification and organization of actions within the monitoring dashboard. Moreover, query parameters and request body data are set as span attributes, offering a comprehensive view of the request details, which can prove essential in understanding the context of each action.

One of the key benefits of integrating Fastify with AppSignal is the automatic tracking of errors. This feature ensures that developers are promptly notified of any issues that arise within their application, allowing them to address problems quickly and maintain the overall reliability and user experience of their web application.

Let's trigger a few routes on the API we created above and look at how we can explore this within AppSignal. So, either using an API client (like Postman or Insomnia) or your web browser, trigger the following routes:

- http://localhost:3000/
- http://localhost:3000/error
- http://localhost:3000/not-here
- http://localhost:3000/not-here?test=here

On the AppSignal dashboard page, select `Overview` on the left hand menu.

![[CleanShot 2023-04-14 at 12.37.00.png]]

1. In this menu, we can decide what time period to zoom in or out too. This can help focus on a particular time period or get a birds-eye view of how an application is performing on the long term.
2. These three graphs draw attention to the most important metrics to monitor. Have them front and center on the dashboard allows you to keep them top of mind.
3. Here we have the latest open errors - we'll zoom into this in a moment.
4. Lastly, we have the latest performance measurements. Again, we'll zoom in there soon.

## Errors
AppSignal does a great job of grouping together errors of the same type. This stops potential issues being hidden in a live stream of data. We also get the tools to help with collaboration and shared investigation of issues in our application.

![[CleanShot 2023-04-14 at 12.43.58.png]]

This is the error summary page and there is a lot going on here.
1. First, we have the HTTP method and route where this error has been triggered. All of the automated logging is identified in this way which allows AppSignal to group the errors more reasonably.
2. Next, we have the error message that was raised by the appliocation and the end of the backtrace. This is the summary page and so we don't get a full stack trace.
3. We can click on the `Inspect latest sample` to be able to see a full request/response cycle to allow for more targetted investigation.
4. There is a logbook here which can allow you to record what you've tried and excluded. This kind of shared notebook reduces the chances of multiple colleagues wasting time on the same approach.
5. We can see here if there is a trend for this error, over the past day or 30 days.
6. In the settings panel, we can assign this error and decide when we should alert colleagues. This is an excellent triaging mechanism, allowing teams to focus energies on open and important issues.
7. Lastly, any of the attributes that are similar between these requests are gathered and displayer here.

There are other tabs along the top. You can explore these yourself but I'll draw your attention in particular to the `Samples` tab.
![[CleanShot 2023-04-14 at 12.49.33.png]]

This allows us to filter results based on the attributes and to click through to see the details of any of the requests that have triggered this error.

## Route performance
We can see that when our application throws an error, that this will be tracked effectively. What about identifying performance based issues?

![[CleanShot 2023-04-14 at 12.57.44.png]]

This is the latest sample from analysing the GET requests from our API.
1. We've got a clear description of what types of requests are grouped together to make these samples.
2. Here we can set the warning level. It defaults to 10 seconds. So, if your API takes more than 10 seconds to respond, AppSignal will send an alert. You can lower this threshold for 200ms or raise it to around 60 minutes depending on your needs.
3. Here we have a description of the sample. We can see this request resulted in a 404 error.
4. Again, we've a visual graph of trends, allowing us to get a quick understanding of any potential drops or spikes in performance.
5. We can analyse other samples to compare and contrast the performance by clicking between them here.
Further down this page, we can find the attributes that describe this response as well as any parameters that were sent as part of the request URL.

These performance metrics are gathered based on actions. These are described by the method and the route. I'm going to set up a simple CRUD API with a MongoDB backend.

## Adding a CRUD API

This tutorial assumes you have MongoDB set up on your system already. If you don't you can head to the MongoDB website and get yourself set up. 

To build the API, first I added these libraries:

```
npm install @fastify/mongodb fastify-plugin
```

I created a database connector plugin in a file called `db.js`:

```js
const fastifyPlugin = require("fastify-plugin");
const fastifyMongo = require("@fastify/mongodb");

/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
async function dbConnector(fastify, options) {
  fastify.register(fastifyMongo, {
    url: "mongodb://localhost:27017/test_database",
  });
}

module.exports = fastifyPlugin(dbConnector);
```

Next, I brought the routes into their own file, `routes.js`, and added the routes for my animal api:

```javascript
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection("test_collection");

  fastify.get("/", async (request, reply) => {
    return { hello: "me" };
  });

  fastify.get("/error", async () => {
    throw new Error("This is a test error.");
  });

  fastify.get("/animals", async (request, reply) => {
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error("Only 1 document found");
    }
    return result;
  });

  fastify.get("/animals/:animal", async (request, reply) => {
    const result = await collection.findOne({ animal: request.params.animal });
    if (!result) {
      throw new Error("Invalid value");
    }
    return result;
  });
  
  fastify.delete("/animals/:animal", async (request, reply) => {
    const result = await collection.deleteOne({
      animal: request.params.animal,
    });
    if (result.deletedCount === 0) {
      return reply
        .code(404)
        .send({ error: true, message: "This item doesn't exist" });
    }
    return reply.code(204).send("");
  });

  const animalBodyJsonSchema = {
    type: "object",
    required: ["animal"],
    properties: {
      animal: { type: "string" },
    },
  };

  const schema = {
    body: animalBodyJsonSchema,
  };

  fastify.post("/animals", { schema }, async (request, reply) => {
    // we can use the `request.body` object to get the data sent by the client
    const result = await collection.insertOne({ animal: request.body.animal });
    return result;
  });
}

module.exports = routes;
```

Lastly, back in my `app.js`, I imported and registered my plugins:

```javascript
fastify.register(require("./db"));
fastify.register(require("./routes"));
```

## Using the CRUD API
With these routes setup, I can query each of the routes. 

Back on the AppSignal Actions page, I can now see each of actions with performance metrics:

![[CleanShot 2023-04-14 at 13.12.56.png]]

1. As before, we have the ability to change the time range. We also have the `Custom range` which allows us to be forensic in our tracking.
2. Here are the list of actions. Clicking any of these links will take us to the summary page for this action. As well as linking to any errors, we can get access to all of the related samples that make up this data set.
3. A quick visual of the mean time it takes for each of our actions to respond. The slowest one is `/demo` which is a sample route provided by AppSignal. 
4. The mean is a good measure, by the 90th percentile tells us the speed at which 90% of our users receive a response. If these numbers are far apart it might be worth an investigation.
5. The throughput is the total number of requests sent through the action in the time frame we've chosen.
6. The summary statistics at the bottom gives us a decent summary on how our application is performing.

The AppSignal integration means we don't need to add any custom instrumentation and can benefit for the error and performance tracking straight-away.


## Conclusion
Integrating Fastify with AppSignal provides a powerful combination for developers seeking to create high-performance web applications while ensuring seamless error tracking and monitoring. Fastify's speed, efficiency, and extensibility make it an ideal choice for backend developers working with Node.js applications. Meanwhile, AppSignal's robust error tracking and performance monitoring capabilities equip developers with the insights necessary to maintain their applications' reliability and user experience.

The integration enables you to quickly fix bugs and identify performance bottlenecks, ensuring that your application remains in top condition. We encourage you to explore the capabilities of both Fastify and AppSignal further and leverage their strengths to build and maintain highly performant and reliable web applications.