var casper = require('casper').create({
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    }
});
 
//First step is to open goodreads
casper.start().thenOpen("https://goodreads.com", function() {
    console.log("goodreads opened");
});
 
//Now we have to populate username and password, and submit the form
casper.then(function(){
    console.log("Login using username and password");
    this.evaluate(function(){
        document.getElementById("userSignInFormEmail").value="dwilliamrobertson@gmail.com";
        document.getElementById("user_password").value="ruinous3919";
        document.querySelector('input[value="Sign in"]').click();
    });
});
 
//Wait to be redirected to the Home page, and then make a screenshot
casper.then(function(){
  this.wait(3000, function(){
    console.log("Make a screenshot and save it as AfterLogin.png");
    this.capture('AfterLogin.png');
  });
});

// fill the search form and submit
casper.then(function(){
    this.fill('form[action="/search"]', {
      q: "fight club"
    }, true);
});

//Wait for page to load and take a screen shot to see the search worked
casper.then(function(){
  this.wait(3000, function(){
    console.log("Make a screenshot and save it as AfterSearch.png");
    this.capture('AfterSearch.png');
  });
});

// simulate click to add book to currently reading
casper.then(function(){
  this.evaluate(function(){
    document.querySelector('button[value="currently-reading"]').click();
  });
});

// wait for load and take a screenshot to show the book has been added to currently reading
casper.then(function(){
  this.wait(3000, function(){
    console.log("Make a screenshot and save it as AfterReadingSelected.png");
    this.capture('AfterReadingSelected.png');
  });
});

// navigate back to home to update book status
casper.then(function(){
  this.evaluate(function(){
    document.querySelector('a[href="/"]').click();
  });
});

// click update status on first book
casper.then(function(){
  this.evaluate(function(){
    document.querySelector('button[class="gr-nakedButton gr-nakedButton--asLink u-marginTopTiny"]').click();
  });
});

// click the toggle in the module from pages to percent
// send the amount to the module input
casper.then(function(){
  this.evaluate(function(){
    document.querySelector('button[class="buttonToggle"]').click();
  });
  this.sendKeys('input[class="gr-textInput updateReadingProgress__headerInput"]', '27');
});

// submit updated changes
casper.then(function(){
  this.evaluate(function(){
    document.querySelector('button[class="gr-button longTextPopupForm__submitButton"]').click();
  });
});

// take a screenshot to show that the book has been updated
casper.then(function(){
  this.wait(3000, function(){
    console.log("Make a screenshot and save it as AfterUpdated.png");
    this.capture('AfterUpdated.png');
  });
});
 
casper.run();


