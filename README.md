#Front End Web Project Starter Kit

You can use this template to kick start a front-end web project that uses gulp, sass and ES6. It essentially sets up a gulp build pipeline. I would recommend [3D Buzz's Using Modern JavaScript Today](https://www.3dbuzz.com/training/view/using-modern-javascript-today/details "Using Modern JavaScript Today") course if you would like to learn build pipelines for web projects using gulp. It also covers a whole lot of other essential skills for web developemnt. Of course, feel free to learn from other sources, but that's where I learnt it from and I enjoyed it.

###Workflow
---
The source images, sass and es6 code are located in the src directory. This is where you will create all your application files.

---
The build system uses two different pipelines - one for production and one for development. The production pipeline is optimized for performance whereas the development pipeline is optimized for ease of debugging. 

**Development pipeline**
1. SaSS - SaSS code is compiled with sourcemaps and beautification enabled.
2. es6 - All code is concatenated into a single app.js file.
3. Images - Used as is.
4. HTML - Beautification is enabled

**Production pipeline**
1. SaSS - SaSS code is compiled with uglification enabled and sourcemaps disabled.
2. es6 - All code is concatenated into a single app.js file.
3. Images - Used as is.
4. HTML - Used as is.

---

There are 4 main gulp tasks:

1. *dev:build* - Generate the application bundle in dev_dist directory.
2. *prod:build* - Generate the application bundle in dist directory.
3. *dev* - This runs the dev:build task and also starts watching the src files for running dev tasks.
4. *prod* - This runs the prod:build task and also starts watchign the src files for running prod tasks.

---
###Quickstart

1. Make sure you download the project and commit it into your repo. If you decide to clone, then your repo will have this project's git history, which may not be preferrable.

2. Run `npm install` to download all the dependencies.

3. Run `gulp dev`.

4. You will see a directory called `dev_dist`. Navigate into this directory and use your favorite http server to serve this directory. I use [live-server][1].

5. You're done! Based on which http server you used, navigate to `index.html` in your browser and you should see the development version of the application.

---

###Other Options
1. If you had used `gulp prod` instead of `gulp dev` in the above quickstart, then you would see the production version of the application in the `dist` directory.

2. Use `gulp dev:build` or `gulp prod:build` in case you just want to build the project, but don't want to watch the files.

3. You probably wouldn't want `dev_dist` in the repository. Feel free to add it to `.gitignore` file.

[1]: https://www.npmjs.com/package/live-server