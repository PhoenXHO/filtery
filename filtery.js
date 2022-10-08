/*! Filtery v1.0.3
* Copyright (c) 2022 PhoenixHO
* Licensed under: MIT License
* REFER TO LICENSE AT: https://github.com/PhoenXHO/filtery/blob/master/LICENSE
*/

;(function (root, factory) {
	if (typeof exports === "object") {
		module.exports = factory(root);
	} else if (typeof define === "function" && define.amd) {
		define([], factory);
	} else {
		root.Filtery = factory(root);
	}
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		root = window;
	}

	NodeList.prototype.filter = function (selector) {
		return Array.prototype.filter.call(this, function (arr) {
			return arr.matches(selector);
		});
	};

	var self;
	function Filtery($element, options) {
		self = this;

		this.defaults = {
			itemSelector: ".item",
			columns: 3,
			gap: 10,
			animationDuration: 400,
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
		};

		this.$filterButtons = document.querySelectorAll("#filter a");
		this.$currentFilter = this.$filterButtons.filter(".current")[0];
		this.$parent = $element;
		this.$items = this.$parent.querySelectorAll(this.defaults.itemSelector);
		this.$activeItems = this.$items;
		this.$hiddenItems = null;

		this.filter = "all";
		this.columnWidth = 0;

		this.defaults = {...this.defaults, ...options};

		this.init();
	}

	Filtery.prototype = {
		init: function () {
			window.addEventListener("load", function () {
				self.overrideSettings();
				self.getColumnWidth();
				self.initCSS();
				self.initFilters();
				self.orderItems();
			});

			let resizeTimer;
			window.addEventListener("resize", function () {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function () {
					self.overrideSettings();
					self.getColumnWidth();
					self.orderItems();
				}, 100);
			});
		},

		overrideSettings: function () {
			let responsive = Object.entries(this.defaults.responsive);
			if (!responsive.length) return;

			let winWidth = window.innerWidth;

			let newSettings = responsive.reduce(function (prev, entry) {
				entry[0] = parseInt(entry[0]);
				return prev[0] <= entry[0] && entry[0] < winWidth ? entry : prev;
			}, [0, {}]);

			this.defaults = {...this.defaults, ...newSettings[1]};
		},

		getColumnWidth: function () {
			let columns = this.defaults.columns,
				itemWidth = this.columnWidth = (this.$parent.clientWidth - this.defaults.gap * (columns - 1)) / columns;
			this.$items.forEach(function ($e) {
				$e.style.width = itemWidth + "px";
			});
		},

		initCSS: function () {
			this.$parent.style.position = "relative";
			this.$parent.style.transition = "all " + self.defaults.animationDuration + "ms ease";

			this.$items.forEach(function ($e) {
				$e.style.position = "absolute";
				$e.style.transform = "scale3d(1, 1, 1)";
				$e.style.opacity = "1";
				$e.style.top = "0";
				$e.style.left = "0";
				$e.style.transition = "all " + self.defaults.animationDuration + "ms ease, width 0s";
			});
		},

		initFilters: function () {
			if (this.$currentFilter) {
				this.filter = this.$currentFilter.dataset["filter"];
			} else {
				this.$currentFilter = this.$filterButtons[0].classList.add("current");
				this.initFilters();
			}

			this.$filterButtons.forEach(function ($e) {
				$e.addEventListener("click", function (event) {
					event.preventDefault();
					self.handleFilter(this);
				});
			});
			self.handleFilter(this.$currentFilter);
		},

		handleFilter: function ($filter) {
			let category = $filter.dataset["filter"];
			
			if (category === this.filter) return;

			this.filter = category;
			this.$currentFilter.classList.remove("current");
			$filter.classList.add("current");
			this.$currentFilter = $filter;

			if (category === "all") {
				this.$activeItems = this.$items;
				this.$hiddenItems = null;
			} else {
				this.$activeItems = this.$items.filter("[data-category=\"" + category + "\"]");
				this.$hiddenItems = this.$items.filter(":not([data-category=\"" + category + "\"])");
			}

			this.orderItems();
		},

		orderItems: function () {
			let columns = this.defaults.columns,
				columnWidth = this.columnWidth,
				columnHeights = Array(columns).fill(0);

			let gap = this.defaults.gap;

			if (this.$hiddenItems) {
				this.$hiddenItems.forEach(function ($e) {
					$e.classList.add("hidden-filtery-item");
				});
			}

			this.$activeItems.forEach(function ($e) {
				$e.classList.remove("hidden-filtery-item");
			});
			
			this.$activeItems.forEach(function ($e, id) {
					let columnId = id % columns,
						posX = columnId * columnWidth,
						posY = columnHeights[columnId];

					columnHeights[columnId] += $e.offsetHeight + gap;

					$e.style.left = (posX ? posX + gap * columnId : 0) + "px";
					$e.style.top = posY + "px";
				});

			this.$parent.style.height = Math.max(...columnHeights) - gap + "px";
		},
	};

	root.filtery = function ($element, options) {
		return new Filtery($element, options);
	}

	if (root.jQuery) {
		var $ = root.jQuery;

		$.fn.filtery = function (options) {
			return this.each(function () {
				new Filtery($.makeArray(this)[0], options);
			});
		};
	}
});
