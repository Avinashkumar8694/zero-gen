# Zero-Gen

Zero-Gen is a command-line tool designed to streamline the process of generating and managing components and modules in a project. It provides a set of commands to initialize a new project, create components or modules, build the project, and start development or production servers.

## Features

- Initialize a new project with a predefined structure
- Create new components or modules with ease
- Build the project for production
- Start a development server for live reloading
- Serve the project using an Express server

## Installation and Setup

To install Zero-Gen, you need to have Node.js and npm installed on your machine. You can install Zero-Gen globally using npm:

```sh
npm install -g zero-gen
```

## Usage

### General Usage

```sh
zero-gen [options] [command]
```

### Options

- `-V, --version`                   output the version number
- `-h, --help`                      display help for command

### Commands

#### `init <projectName>`

Initialize a new project.

Example:

```sh
zero-gen init my-project
```

#### `create [options] <type> <name>`

Create a new component or module.

Options:
- `-d, --desc <description>`  Add a description

Example:

```sh
zero-gen create component my-component -d "This is a new component"
zero-gen create module my-module -d "This is a new module"
```

#### `build <pluginName>`

Compile or package the project.

Example:

```sh
zero-gen build my-plugin
```

#### `start [options]`

Start the development server.

Options:
- `-p, --port <port>`  Specify port number (default: 3000)

Example:

```sh
zero-gen start -p 4000
```

#### `serve`

Start the express server to serve plugins.

Example:

```sh
zero-gen serve
```

## Contributing

We welcome contributions to Zero-Gen! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on GitHub.

### Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and concise messages.
4. Push your changes to your forked repository.
5. Open a pull request to the main repository.

## License

Zero-Gen is licensed under the ISC License. See the LICENSE file for more details.
