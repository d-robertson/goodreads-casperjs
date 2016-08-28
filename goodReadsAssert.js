// set up enviorment variables for password and email
var envVars = require('system').env;

// create my test suite
casper.test.begin('test login for good reads and user experience', 4, function suite(test){
  //set up messages that will print to the console
  casper.on("remote.message", function(msg){
    this.echo("remote.msg: " + msg, 'INFO');
  });

  casper.on("page.error", function(pageErr){
    this.echo("page.err: " + JSON.stringify(pageErr), 'ERROR');
  });

  // open goodreads.com check to see if the login exists
  // pass in env vars for evaluate function
  // fill out the login with email and password and simulate a click event to submit
  casper.start("https://goodreads.com", function(){
    test.assertExists('form[name="sign_in"]', 'login form is found.');

    this.evaluate(function(email, password){
        document.getElementById("userSignInFormEmail").value=email;
        document.getElementById("user_password").value=password;
        document.querySelector('input[value="Sign in"]').click();
    }, envVars.email, envVars.password);
  });
  // take a screen shot to show I have logged in
  casper.then(function(){
    this.wait(3000, function(){
      console.log("Make a screenshot and save it as AfterLogin.png");
      this.capture('AfterLogin.png');
    });
  });
  // check to see if the search form exists
  // fill out the search form and submit
  casper.then(function(){
    test.assertExists('form[action="/search"]', 'search form found');
    this.fill('form[action="/search"]', {
      q: "Fight Club"
    }, true);
  });
  // take a screenshot to show I have searched what I want
  casper.then(function(){
    this.wait(3000, function(){
      console.log("Make a screenshot and save it as AfterSearch.png");
      this.capture('AfterSearch.png');
    });
  });
  // query all books on the page and loop through them looking for the first
  // instance of the book title matching my search term and simulate a click
  // setting the book to currently reading
  casper.then(function(){
    this.evaluate(function(){
      var tempArray = document.querySelectorAll('tr[itemtype="http://schema.org/Book"]');
      var toggle = 0;

      for(var i=0;i<tempArray.length;i++){
        if(tempArray[i].querySelector('span[itemprop="name"]').innerHTML === "Fight Club" && toggle === 0){
          
          tempArray[i].querySelector('button[value="currently-reading"]').click();
          toggle = 1;

        } 
      }
    });
  });
  // test to make sure the book has been set to currently reading
  casper.then(function(){
    this.wait(3000, function(){
      test.assertExists('div[class="wtrDown wtrLeft wtrStatusReadingNow"]', 'Set Book to currently-reading');
    });
  });
  // take a screenshot to show the book has been set to currently reading
  casper.then(function(){
    this.wait(3000, function(){
      console.log("Make a screenshot and save it as AfterReadingSelected.png");
      this.capture('AfterReadingSelected.png');
    });
  });
  // simulate a click navigating to the home page
  casper.then(function(){
    this.evaluate(function(){
      document.querySelector('a[href="/"]').click();
    });
  });
  // test to see currently on home page
  // loop through all the books that are currently reading checking against search term
  // simulate a click to open up the module
  casper.then(function(){
    test.assertExists('body[class="gr-homePageBody"]', 'On home page');
    this.evaluate(function(){
      var tempArray = document.querySelectorAll('div[class="gr-mediaBox gr-book--medium gr-book"]');
      for(var i = 0; i<tempArray.length; i++){
        if(tempArray[i].querySelector('a[class="gr-book__titleLink gr-hyperlink gr-hyperlink--naked"]').innerHTML === "Fight Club"){
          tempArray[i].querySelector('button[class="gr-nakedButton gr-nakedButton--asLink u-marginTopTiny"]').click();
        }
      }
    });
  });
  // simulate a click to change from pages to percent in module
  // set input to 27
  casper.then(function(){
    this.evaluate(function(){
      document.querySelector('button[class="buttonToggle"]').click();
    });
    // I was trying to set the value with querySelector but on submit the value wouldn't regester
    // so I found this sendKeys method and it worked.
    this.sendKeys('input[class="gr-textInput updateReadingProgress__headerInput"]', '27');
  });
  // simulate click to update changes in module
  casper.then(function(){
    this.evaluate(function(){
      document.querySelector('button[class="gr-button longTextPopupForm__submitButton"]').click();
    });
  });
  //take a screen shot to show the books reading percent has been changed
  casper.then(function(){
    this.wait(3000, function(){
      console.log("Make a screenshot and save it as AfterUpdated.png");
      this.capture('AfterUpdated.png');
    });
  });
  // query the dom and print out in console title author and percent to show
  // everything worked
  casper.thenEvaluate(function(){
    title = document.querySelector('a[class="gr-book__titleLink gr-hyperlink gr-hyperlink--naked"]').innerHTML;
    author = document.querySelector('a[href="https://www.goodreads.com/author/show/2546.Chuck_Palahniuk"]').innerHTML;
    percent = document.querySelector('small[class="u-displayBlock"]').innerHTML;
    console.log("book title: ", title);
    console.log("Author: ", author);
    console.log("Percent complete: ", percent);
  });
  // finish test
  casper.run(function(){
    test.done();
  });
});



