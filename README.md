# OnePageJS
OnePageJS is an open-source JavaScript library designed to help you create
seamless, smooth-scrolling one-page applications. With this library, you
can easily add scroll-based navigation to your website, allowing users
to navigate between sections with smooth transitions. It is lightweight,
easy to integrate, and works with a variety of front-end frameworks.

## Navigation
- [State](README#State)
- [Javascript Support](<README#Javascript Support>)
- [Features](README#Features)
- [License](README#License)

## State
OnePageJS is still in the early stages of development. While it provides
essential features for creating smooth scrolling experiences, expect
ongoing improvements and new features in future releases.

## Dependencies
OnepageJS is shipped as a single JavaScript file, so there are no external
dependencies required for basic usage.

However, if you're contributing to the project, you will need to install
[Bun](https://bun.sh/). This because Bun is used for several development tasks, including running tests,
bundling the files, and launching the development server.

## Javascript Support
OnePageJS is written in pure JavaScript and is designed to work seamlessly
across most modern front-end frameworks. You should be able to integrate
it easily into your project, whether you're using vanilla JavaScript,
React, Vue, Angular, or other common front-end frameworks.

However, if you're using a framework with a specific build system or
configuration, ensure that the library is properly bundled and included
in your project. For most projects, you can include the library as a
script tag or directly import it on your main component.

## Features
- Smooth scrolling: Transition between sections with smooth scrolling.
- Easy setup: No dependencies required for basic usage.
- Customizable: Supports basic configuration for scroll speed, easing functions, and navigation controls.
- Responsive: Fully responsive and mobile-friendly.
- Compatibility: Works with modern browsers and most front-end frameworks.

## Usage
```html
<head>
    <!-- ... -->

    <!-- Import Onepage -->
    <script type="text/javascript" src="include_path/onepage.js"></script>

    <!-- ... -->
  </head>

  <body>
    <!-- ... -->

    <script>
        // OnePageJS auto-initialization with custom options
        Onepage.setOptions({
          scroll: {
            overflowScroll: true  // Enables overflow scrolling for sections
          }
        });
    </script>
  </body>
```

## License
**OnePageJS** is released under the [Zero-Clause
BSD](https://opensource.org/license/0bsd), meaning you’re free to use,
modify, and distribute it as you like with no restrictions.
