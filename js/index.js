var searchableMall = angular.module('SearchableMall', []);

searchableMall.constant('BG_HIGHLIGHT', 'yellow');
searchableMall.constant('TEXT_HIGHLIGHT', 'black');
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

searchableMall.controller('SearchableController', ['$scope', 'PRODUCT_DATA', 'BG_HIGHLIGHT', 'TEXT_HIGHLIGHT', function($scope, PRODUCT_DATA, BG_HIGHLIGHT, TEXT_HIGHLIGHT) {
	$scope.products = PRODUCT_DATA;

	$scope.results = [];

	$scope.$watch('query', function(newVal, oldVal) {
		if ($scope.results.length > 0) {
			unhighlight($scope.results);
		}

		var results = _.filter(PRODUCT_DATA, function(item) {
			return _.find(item.keywords, function(keyword) {
				return ~keyword.indexOf(newVal);
			});
		});

		$scope.results = results;
		$scope.results_count = $scope.results.length;

		_.each(results, function(result) {
			highlight(result.name);
		});
	});

	function highlight(result) {
		_.each($('#' + result).children(), function(child) {
			child.style.fill = BG_HIGHLIGHT;
		});

		_.each($('#' + result + ' > text').children(), function(child) {
			child.style.fill = TEXT_HIGHLIGHT;
		});
	}

	function unhighlight(results) {
		_.each(results, function(result) {
			_.each($('#' + result.name).children(), function(child) {
				child.style.fill = '';
			});

			_.each($('#' + result.name + ' > text').children(), function(child) {
				child.style.fill = '';
			});		
		});
	}
}]);