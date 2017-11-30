angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

  .state('menu.derine', {
    url: '/Derine',
    views: {
      'side-menu21': {
        templateUrl: 'templates/derine.html',
        controller: 'derineCtrl'
      }
    }
  })

  .state('menu.page7', {
    url: '/personal',
    views: {
      'side-menu21': {
        templateUrl: 'templates/page7.html',
        controller: 'page7Ctrl'
      }
    }
  })

  .state('menu.page8', {
    url: '/Description',
    views: {
      'side-menu21': {
        templateUrl: 'templates/page8.html',
        controller: 'page8Ctrl'
      }
    }
  })

  .state('menu.page9', {
    url: '/about',
    views: {
      'side-menu21': {
        templateUrl: 'templates/page9.html',
        controller: 'page9Ctrl'
      }
    }
  })

  .state('menu', {
    url: '/menu',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('page4', {
    url: '/login',
    templateUrl: 'templates/page4.html',
    controller: 'page4Ctrl'
  })

  .state('page5', {
    url: '/welcome',
    templateUrl: 'templates/page5.html',
    controller: 'page5Ctrl'
  })

  .state('page6', {
    url: '/Signup',
    templateUrl: 'templates/page6.html',
    controller: 'page6Ctrl'
  })

$urlRouterProvider.otherwise('/welcome')


});