/*jshint unused:false */

(function (exports) {

	'use strict';

	var STORAGE_KEY = 'todos-vuejs';
	exports.todoStorage = {
		fetch: function () {
			return [];
			//return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		save: function (todos) {
			//localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
			axios.post('/settodo', {
			body: todos
			})
			.then(response => {
				console.log(response);
			})
			.catch(e => {
				this.errors.push(e)
			})
		}
	};

})(window);
