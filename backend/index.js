const {
  serviceApp,
  addErrorHandlingMiddleware,
  startServer,
} = require("./serviceApp");

const {
  env: prabandh_env,
  routers: PRABANDH_routers,
} = require("./prabandh_service");

const {
  env: testing_env,
  routers: TESTING_routers,
} = require("./testing_service");

const prabandhApp = serviceApp(prabandh_env, PRABANDH_routers, "/");
const testingApp = serviceApp(testing_env, TESTING_routers, "/apitesting");

addErrorHandlingMiddleware(prabandhApp);
startServer(prabandhApp, prabandh_env);

addErrorHandlingMiddleware(testingApp);
startServer(testingApp, testing_env);
