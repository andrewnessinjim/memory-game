# Memory Game
---

#### Playing the game

Head over [here][1] to play the game. You will find the directions to play the game as soon as you open the link.

#### Running the game locally
This project is built using [gulp][3]. After you [clone][4] or [fork][5] this project, you should have a local copy of the project on your computer.

1. Navigate to the root directory of the project where you can find the `package.json` file. Run `npm install` here to download all the dependencies. You can learn about npm [here][6].

2. The root directory of the project also contains `gulpfile.js` file. Run `gulp dev` to build the project. This will also start watching the files for changes, so the process will continue to run. Let that process be active.

3. Now that you have run the gulp task, you will see a directory called `dev_dist`. Navigate into this directory and use your favorite http server to serve out this directory. I use [live-server][7] (Note that your path can be anything):

```
$ live-server
Serving "/media/user/Data/projects/memory-game/dev_dist" at http://127.0.0.1:8080
Ready for changes
```

4. You can now access the game through this link: `http://127.0.0.1:8080`


If you face any difficulties while setting up the project, or would like any help understanding the project, feel free to email me at andrewnessinjim@yahoo.com. If you have understood the project, but would like to contribute or suggest features, please raise an an issue instead. We will take it further from there.

#### Contributing

Check [this][2] for contributing. Here, you will find information on how the code is oraganised, if you need it.

[1]: https://andrewnessinjim.github.io/memory-game/dev_dist/index.html
[2]: https://github.com/andrewnessinjim/memory-game/blob/master/CONTRIBUTING.md
[3]: https://gulpjs.com/
[4]: https://git-scm.com/docs/git-clone
[5]: https://help.github.com/articles/fork-a-repo/
[6]: https://docs.npmjs.com/getting-started/what-is-npm
[7]: https://www.npmjs.com/package/live-server