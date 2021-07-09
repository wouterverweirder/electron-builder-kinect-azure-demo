# electron builder & kinect azure

> A demo project using my [kinect-azure](https://github.com/wouterverweirder/kinect-azure) library in an electron builder project.

This demo uses the kinect body tracking SDK. In order for body tracking to work, the necessary DLLs need to be in the DLL lookup path. The easiest way to ensure this, is to have the DLL files in your application's directory.

I have added a "copy-dlls" script in the package.json file to copy the dlls from the body tracking SDK into this project's directory. Run it before trying to start the dev script:

```
npm run copy-dlls
```

The package.json file contains an "extraFiles" setting for electron builder to copy those DLL files when creating a release build:

```json
  "build": {
    "appId": "be.aboutme.kinect-azure.electron-builder-kinect-azure-demo",
    "win": {
      "extraFiles": [
        {
          "from": "C:\\Program Files\\Azure Kinect Body Tracking SDK\\tools",
          "to": "./"
        }
      ]
    }
  },
```

## electron-webpack

Thanks to the power of `electron-webpack` this template comes packed with...

* Use of [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) for development
* HMR for both `renderer` and `main` processes
* Use of [`babel-preset-env`](https://github.com/babel/babel-preset-env) that is automatically configured based on your `electron` version
* Use of [`electron-builder`](https://github.com/electron-userland/electron-builder) to package and build a distributable electron application

Make sure to check out [`electron-webpack`'s documentation](https://webpack.electron.build/) for more details.

### Getting Started
Simply clone down this repository, install dependencies, and get started on your application.

The use of the [yarn](https://yarnpkg.com/) package manager is **strongly** recommended, as opposed to using `npm`.

```bash
# create a directory of your choice, and copy template using curl
mkdir new-electron-webpack-project && cd new-electron-webpack-project
curl -fsSL https://github.com/electron-userland/electron-webpack-quick-start/archive/master.tar.gz | tar -xz --strip-components 1

# or copy template using git clone
git clone https://github.com/electron-userland/electron-webpack-quick-start.git
cd electron-webpack-quick-start
rm -rf .git

# install dependencies
yarn
```

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```
