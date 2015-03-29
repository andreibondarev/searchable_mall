var searchableMall = angular.module('SearchableMall', ['ngAnimate']);

searchableMall.constant('BG_HIGHLIGHT', 'yellow');
searchableMall.constant('TEXT_HIGHLIGHT', 'black');
searchableMall.constant('PRODUCT_DATA', [
	{
		id: 'icing_by_claires',
		store: 'Icing by Claire\'s',
		details: "ICING strives to show you our latest and greatest products as you’re surfing our site. However, we can’t always guarantee that the products we show online will be available in all stores at all times. For more...",
		hours: 'Monday - Saturday: 10am - 9:30pm, Sunday: 11am - 6pm',
		categories: ['Accessories', 'Cosmetics', 'Jewelry'],
		keywords: [],
		image: 'images/icing_by_claires.jpg'
	},
	{
    	id: 'henri_bendel',
    	store: 'Henri Bendel',
    	hours: 'Monday - Saturday: 10am - 9:30pm, Sunday: 11am - 6pm',
    	details: "Henri Bendel is a girls' playground, where Bendel girls go to find the new and the next in accessories, cosmetics and gifts.  Since 1895, signature brown and white stripe Henri Bendel shopping bags have been spotted...",
    	categories: ["Women's Fashions", "Accessories", "Women's Specialty"],
    	keywords: [],
    	image: 'images/henri_bendel.jpg'
    },
	{
	    id: 'free_people',
	    store: 'Free People',
	    hours: 'Monday - Saturday: 10am - 9:30pm, Sunday: 11am - 6pm',
        details: 'The Free People woman lives free through fashion, art, music, and travel. She is a free spirit, pushing the limits in the name of adventure. The eclectic look consists of quality apparel, shoes, and accessories that...',
        categories: ["Women's Fashions"],
        keywords: [],
        image: 'images/free_people.jpg'
    }, {
        id: 'francescas_collections',
		store: 'Francesca\'s Collection',
		hours: 'Monday - Saturday: 10am - 9:30pm, Sunday: 11am - 6pm',
        details: "Francesca's specializes in the most fashion-forward styles in women's clothing, accessories, and gifts. Our stores are constantly filled with new treasures and our style is always one step ahead of the trend. Each...",
        categories: ['Jewelry & Watches', "Women's Fashions", "Accessories"],
		keywords: [],
        image: 'images/francescas_collections.jpg'
    }, {
    	id: 'accessorize',
    	store: 'Accessorize',
		hours: "Monday - Saturday: 10am - 9:30pm, Sunday: 11am - 6pm",
		categories: ['Accessories', 'Outlet', 'Bags', 'Jewelry'],
        details: 'Accessorize is devoted to bringing the most exciting and eclectic products to the high street. With its own in-house design team, Accessorize holds a unique position on the high street with its inspirational, globally...',
        keywords: [],
        image: 'images/accessorize.jpg'
    }, {
    	id: 'lids',
    	store: 'Lids',
    	hours: 'Monday - Saturday: 10am - 9:30pm, Sunday: 11am - 6pm',
		details: "Lids is the world's largest retailer specializing in the sale of officially licensed and branded headwear. Every store offers a vast assortment of college, MLB, NBA, NFL and NHL teams, as well as other specialty fashion...",
		categories: ["Accessories", "Sports Fashion", "Headwear"],
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
