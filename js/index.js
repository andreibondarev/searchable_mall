var searchableMall = angular.module('SearchableMall', []);

searchableMall.constant('PRODUCT_DATA', [{
		store: 'Nordstrom',
		keywords: ['north face', 'columbia']
	}, {
		store: 'Macy\'s',
		keywords: ['columbia']
	},
	{
		store: 'Capital One Bank',
		keywords: ['currency']
	}
	]);

searchableMall.run(function() {

});

searchableMall.controller('SearchableController', ['$scope', 'PRODUCT_DATA', function($scope, PRODUCT_DATA) {
	$scope.products = PRODUCT_DATA;

	$scope.results = [];

	$scope.$watch('query', function(newVal, oldVal) {
		var results = _.filter(PRODUCT_DATA, function(item) {
			return _.find(item.keywords, function(keyword) {
				return ~keyword.indexOf(newVal);
			});
		});

		$scope.results = results;
	});

}]);
