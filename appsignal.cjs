const { Appsignal } = require("@appsignal/nodejs");

new Appsignal({
  active: true,
  name: "test_app",
  pushApiKey: "d200bb7c-ec48-4a74-b5ed-534dd79dd432",
});
