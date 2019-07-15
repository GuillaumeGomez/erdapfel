/* globals require */

const configBuilt = require('@qwant/nconf-builder');
const App = require('./app');
const config = configBuilt.get();
const PORT = config.PORT;

const appServer = new App(config);
appServer.start(PORT);
