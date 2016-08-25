var casper = require('casper').create();
console.log(casper);

casper.start('http://casperjs.org', function(){
  this.echo(this.getTitle());
});

casper.thenOpen('http://phantomjs.org', function(){
  this.echo(this.getTitle());
});

casper.run();