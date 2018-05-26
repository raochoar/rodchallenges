var helper = require('./databaseHelper');

helper.initDatabase(function () {
  console.log('Database init script done.');
})