### Directory Structure

The project was made from [this](https://github.com/andrewnessinjim/front-end-web-starter-kit) template. Please have a look at the documentation there to understand the directory structure.

---

### Application Structure

JS code responsible for generating the UI and listening to user events is present in `src/js/view` directory. This is the view module. In addition, the view module also attaches listeners on the `model` to update itself on the UI.

JS code that handles the actual logic of the app is present in `src/js/model`. This is the model module.

The controller.js file acts as a bridge for the `view` code to communicate with the `model` code. This is the controller module.

The `main.js` file intializes the application by calling all the other code in the proper order.

You will find a separate `scss` file for each of the major UI components in `src/sass` directory.

---