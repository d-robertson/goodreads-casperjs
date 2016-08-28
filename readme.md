#Instalation
  npm install -g phantomjs casperjs
  create .env file in root of project
  in the .env 
    email=(your email for goodreads.com no parenthesis)
    password=(your password for goodreads.com no parenthesis)

##To Run
  casperjs test goodReadsAssert.js

###Results
  This should run through a basic user test for "goodReads.com", search for
  the book fight club set it to currently reading and update the read progress
  to 27%. As well as take 4 screen shots of the user walk through.
