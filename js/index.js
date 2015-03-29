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
	var oldResults = [];

	$(document).on('keydown', function(ev) {
	    if (ev.keyCode == 27) {
	    	$scope.query = '';
	    	$scope.showPanel = false;
			$scope.panelObject = null;
	    }
	});


    $scope.openDetails = function(item) {
        $scope.panelObject = item;
        $scope.showPanel = true;
    }

	$scope.$watch('query', function(newVal, oldVal) {
		var newVal = newVal.toLowerCase();
		$scope.showPanel = false;
		$scope.panelObject = null;

		_.each(oldResults, function(oldResult) {
			highlight(oldResult, true);
		});

		if (newVal) {
			$scope.results = _.filter(PRODUCT_DATA, function(item) {
				var keywords = item.keywords.concat(item.store.toLowerCase(), item.id);
				$scope.queryWords = newVal.split(' ');

				item.score = _.reduce(keywords, function(sum, keyword) {
					return _.reduce($scope.queryWords, function(sum, queryWord) {
						return sum + (~keyword.toLowerCase().indexOf(queryWord) ? 1 : 0);
					}, sum);
				}, 0);

				return !!item.score;
			});
			angular.copy($scope.results, oldResults);

			_.each($scope.results, function(result) {
				highlight(result);
			});
		} else {
			$scope.results = []
		}
	});

	$scope.greaterThanOrEqual = function(prop, val){
	    return function(item){
	      return item[prop] >= val;
	    }
	};

	function highlight(result, undo) {
		try {
			_.each($('#' + result.id).children(), function(child) {
				if (undo) {
					child.style.fill = '';
				} else {
					child.style.fill = BG_HIGHLIGHT;
				}
			});
		} catch(e) {

		}

		try {
			_.each($('#' + result.id + ' > text').children(), function(child) {
				if (undo) {
					child.style.fill = '';
				} else {
					child.style.fill = TEXT_HIGHLIGHT;
				}
			});
		} catch (e) {

		}
	}

}]);
