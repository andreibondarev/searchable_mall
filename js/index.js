var searchableMall = angular.module('SearchableMall', ['ngAnimate']);

searchableMall.constant('BG_HIGHLIGHT', 'yellow');
searchableMall.constant('TEXT_HIGHLIGHT', 'black');
searchableMall.constant('PRODUCT_DATA', [{
	    id: 'nordstrom',
        store: 'Nordstrom',
		keywords: ['north', 'face', 'jackets', 'columbia'],
        details: 'Nordstrom Details',
        image: 'images/lids.jpg'
    }, {
        id: 'macys',
		store: 'Macy\'s',
		keywords: ['columbia', 'north', 'face', 'coats'],
        details: 'Macy\'s Details',
        image: 'images/lids.jpg'
    }, {
        id: 'capital-one-bank',
		store: 'Capital One Bank',
		keywords: ['currency'],
        details: 'Capital One Bank Details',
        image: 'images/lids.jpg'
    }, {
    	id: 'lids',
    	store: 'Lids',
		details: "The LIDS Sports Group, operating within Hat World, Inc., comprises the LIDS retail headwear stores, the LIDS Locker Room specialty fan retail chain, the LIDS Clubhouse retail stores, the LIDS Team Sports wholesale team sports business and its Internet businesses, www.lids.com, www.lids.ca, and www.lidsteamsports.com. Operating out of Indianapolis, Indiana, the retail businesses make up more than 975 mall-based, airport, street level and factory outlet locations nationwide, and in Canada and Puerto Rico. LIDS retail stores offer officially-licensed and branded college, major professional sports teams, as well as other specialty fashion categories all in the latest styles and colors. LIDS Locker Room is a mall-based retailer of sports headwear, apparel, accessories, and novelties. Most LIDS and LIDS Locker Room stores also offer custom embroidery capability. LIDS Clubhouse operates team-specific professional sports and university athletics retail stores and e-commerce websites. LIDS Team Sports is a full-service team uniform and apparel dealer, custom screen printer, embroidery and sporting goods distributor. Hat World, Inc. is a subsidiary of Genesco Inc.",
		keywords: [],
        image: 'images/lids.jpg'
    }
	]);

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
