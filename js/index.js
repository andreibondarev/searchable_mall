var searchableMall = angular.module('SearchableMall', ['ngAnimate']);

searchableMall.constant('BG_HIGHLIGHT', 'yellow');
searchableMall.constant('TEXT_HIGHLIGHT', 'black');
searchableMall.constant('PRODUCT_DATA', window.STORE_DATA);

searchableMall.run(function() {

});

searchableMall.directive('autofocus', ['$interval', function($interval) {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
        	$interval(function() {
	            elem.focus();
        	}, 200);
        }
    };
}]);

searchableMall.controller('SearchableController', ['$scope', 'PRODUCT_DATA', 'BG_HIGHLIGHT', 'TEXT_HIGHLIGHT', function($scope, PRODUCT_DATA, BG_HIGHLIGHT, TEXT_HIGHLIGHT) {
	$scope.products = PRODUCT_DATA;

	$scope.results = [];
	$scope.queryWords = [];

	$(document).on('keydown', function(ev) {
	    if (ev.keyCode == 27) {	$scope.query = ''; }
	});


    $scope.openDetails = function(item) {
        $scope.panelObject = item;
        $scope.showPanel = true;
    }

	$scope.$watch('query', function(newVal, oldVal) {
		$scope.showPanel = false;

        if ($scope.results.length > 0) {
			unhighlight($scope.results);
		}

		if (newVal) {
			$scope.results = _.filter(PRODUCT_DATA, function(item) {
				var keywords = item.keywords.concat(item.store, item.id);
				$scope.queryWords = newVal.split(' ');

				item.score = _.reduce(keywords, function(sum, keyword) {
					return _.reduce($scope.queryWords, function(sum, queryWord) {
						return sum + (~keyword.indexOf(queryWord) ? 1 : 0);
					}, sum);
				}, 0);

				return !!item.score;
			});

			_.each($scope.results, function(result) {
				highlight(result.name);
			});
		} else {
			$scope.results = []
		}
	});

	$scope.greaterThanOrEqual = function(prop, val){
	    return function(item){
	      return item[prop] >= val;
	    }
	}

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
