# filtery
A simple JavaScript to make filterable masonry layouts

## Getting Started

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Options](#options)
4. [JavaScript Events](#javascript-events)

## Installation

You can install this `filtery.js` using NPM, with the following command,

```
$ npm install filtery
```

Refer to the [releases page](https://github.com/PhoenXHO/filtery/releases) to download a specific it manually.

## Basic Usage

With jQuery,

```javascript
$(selector).filtery( [options] );
```

With Vanilla JavaScript,

```javascript
var filtery = new Filtery(document.querySelector(selector) [, options] );
```

where `selector` is a string containing the selector expression for the grid object,
and `options` (_optional_) is a JSON object containing custom settings (Refer to [Options](#options)).

In HTML,

```html
<ul id="filter">
    <li data-filter="all"> <a href="#"> <...> </a> <li>
    <li data-filter="example"> <a href="#"> <...> </a> <li>
    <...>
</ul>

<div id=selector>
    <div data-category="example" class="item"> <...> </div>
    <...>
</div>
```

## Options

Here is a list of the available options with their default values,

With jQuery,

```javascript
$("#filtery").filtery({
    itemSelector: '.item',
    columns: 3,
    gap: 10,
    animationDuration: 400,
    responsive: {}
});
```

With Vanilla JavaScript,

```javascript
var filtery = new Filtery(document.querySelector("#filtery"), {
    itemSelector: '.item',
    columns: 3,
    gap: 10,
    animationDuration: 400,
    responsive: {}
});
```

+ `itemSelector`: the selector expression for the elements of the grid.
+ `columns`: the number of columns in the grid.
+ `gap`: the gap between each item in the grid (in `px`), basically the margin.
+ `animationDuration`: the duration of the animation of the items in the grid.
+ `responsive`: contains the media queries for a responsive grid. It can contain all of the above options.
  + Example:
    ```javascript
    responsive: {
        1280: {
            columns: 3
        },
        991: {
            columns: 2
        },
        0: {
            columns: 1
        }
    }
    ```

## JavaScript Events

To fix some issues with other plugins that register the offsets of elements below a grid before the items are ordered 
(like Waypoints or AOS), two events were added that get dispatched on Filtery elements: `filtery:load`, that triggers 
when the grid is loaded and the items are ordered, and `filtery:resize`, that triggers when the grid is refreshed after 
resizing the window.

Example:

```javascript
$("#filtery").on('filtery:load', function () {
	console.log("Filtery grid has loaded");
});

$("#filtery").on('filtery:resize', function () {
	console.log("Filtery grid has been resized");
});
```
