# [COMP 2406-A4](https://github.com/BraydenGirard/COMP2406-AS4)
Benjamin Sweett (100846396)
Brayden Girard (100852106)

In this assignment we built a web application that uses a database. We also got more practice doing javascript string processing and node.js/express.js programming. This assignment is based on a real project.

We contributed to a larger ongoing project that was started in the recent COMP 2404 C++ programming/C++ classes. In that course the students reverse-engineered a dataset from a popular iPad app store app currently called: iRealPro. We built a web application and database to both search and view this content (music song chord charts) with a browser and also allow the user to edit existing songs or contribute new song data.

In this assignment we picked up where the other students left off and parsed their data file into a JSON mongodb database and then wrote a server that displays the data for the user in the required format and also allow them to either contribute to, or modify, the data via the web pages.

* Source: [https://github.com/BraydenGirard/COMP2406-AS4](https://github.com/BraydenGirard/COMP2406-AS4)

## Quick start

We tested our application in Chrome and FireFox on Mac OS X. To use the application:

1. Run the Node.js Express app using "npm start" from the command line

2. Open a browser and go to "http://localhost:3000/"

3. Start by uploading the data file included with this assignment submission found in /songs

4. Once the upload is successful you can use the keywords field to search for results

5. If you enter no keywords the first 12 songs will be displayed

6. Click on a title button to view it's data 

7. Any user errors will be displayed near the top of the page in red

## Features

* Cross-browser compatible (Chrome, Safari, Firefox 3.6+).
* Uses [Node.js Express](http://expressjs.com/) and [jQuery](http://jquery.com/)
* Allows users upload data files to be parsed into the DB
* Users can search and view song data
* The data is displayed in the browser to be read

## Known Issues

The following issues are known problems with our implementation:

1. Inserting spaces into our Javascript chord strings did not display in the browser. In order to space the bars we added '.' to the end of each chord. The character spacing can sometimes be a little off because of this.

2. The following requirements are missing:  
	R 3.8