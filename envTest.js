var envVars = require('system').env;

casper.test.begin('test', 1, function(test){

  test.assertEquals(envVars.email, 'dwilliamrobertson@gmail.com');

  test.done();
  
});