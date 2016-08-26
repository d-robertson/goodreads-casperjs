casper.test.begin('test login for good reads and user experience', 4, function suite(test){

  casper.on("remote.message", function(msg){
    this.echo("remote.msg: " + msg, 'INFO');
  });

  casper.on("page.error", function(pageErr){
    this.echo("page.err: " + JSON.stringify(pageErr), 'ERROR');
  });

  casper.start("https://goodreads.com", function(){
    test.assertExists('form[name="sign_in"]', 'login form is found.');

    this.evaluate(function(){
        document.getElementById("userSignInFormEmail").value="dwilliamrobertson@gmail.com";
        document.getElementById("user_password").value="ruinous3919";
        document.querySelector('input[value="Sign in"]').click();
    });
  });

  casper.then(function(){
    this.wait(3000, function(){
      console.log("Make a screenshot and save it as AfterLogin.png");
      this.capture('AfterLogin.png');
    });
  });

  casper.then(function(){

    test.assertExists('form[action="/search"]', 'search form found');
    this.fill('form[action="/search"]', {
      q: "Fight Club"
    }, true);
  });

  casper.then(function(){
    this.wait(3000, function(){
      console.log("Make a screenshot and save it as AfterSearch.png");
      this.capture('AfterSearch.png');
    });
  });

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

  casper.then(function(){
    this.wait(3000, function(){
      test.assertExists('div[class="wtrDown wtrLeft wtrStatusReadingNow"]', 'Set Book to currently-reading');
    });
  });

  casper.then(function(){
    this.wait(3000, function(){
      console.log("Make a screenshot and save it as AfterReadingSelected.png");
      this.capture('AfterReadingSelected.png');
    });
  });

  casper.then(function(){
    this.evaluate(function(){
      document.querySelector('a[href="/"]').click();
    });
  });

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

  casper.then(function(){
    this.evaluate(function(){
      document.querySelector('button[class="buttonToggle"]').click();
    });
    // I was trying to set the value with querySelector but on submit the value wouldn't regester
    // so I found this sendKeys method and it worked.
    this.sendKeys('input[class="gr-textInput updateReadingProgress__headerInput"]', '27');
  });

  casper.then(function(){
    this.evaluate(function(){
      document.querySelector('button[class="gr-button longTextPopupForm__submitButton"]').click();
    });
  });

  casper.then(function(){
    this.wait(3000, function(){
      console.log("Make a screenshot and save it as AfterUpdated.png");
      this.capture('AfterUpdated.png');
    });
  });

  casper.thenEvaluate(function(){
    title = document.querySelector('a[class="gr-book__titleLink gr-hyperlink gr-hyperlink--naked"]').innerHTML;
    author = document.querySelector('a[href="https://www.goodreads.com/author/show/2546.Chuck_Palahniuk"]').innerHTML;
    percent = document.querySelector('small[class="u-displayBlock"]').innerHTML;
    console.log("book title: ", title);
    console.log("Author: ", author);
    console.log("Percent complete: ", percent);
  });

  casper.run(function(){
    test.done();
  });
});



