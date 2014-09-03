
//$ExtraViewDirective.$inject = ['$state', '$injector', '$uiViewScroll'];
//function $ExtraViewDirective(   $state,   $injector,   $uiViewScroll) {
//
//  function getService() {
//    return ($injector.has) ? function(service) {
//      return $injector.has(service) ? $injector.get(service) : null;
//    } : function(service) {
//      try {
//        return $injector.get(service);
//      } catch (e) {
//        return null;
//      }
//    };
//  }
//
//  var service = getService(),
//    $animator = service('$animator'),
//    $animate = service('$animate');
//
//  // Returns a set of DOM manipulation functions based on which Angular version
//  // it should use
//  function getRenderer(attrs, scope) {
//    var statics = function() {
//      return {
//        enter: function (element, target, cb) { target.after(element); cb(); },
//        leave: function (element, cb) { element.remove(); cb(); }
//      };
//    };
//
//    if ($animate) {
//      return {
//        enter: function(element, target, cb) { $animate.enter(element, null, target, cb); },
//        leave: function(element, cb) { $animate.leave(element, cb); }
//      };
//    }
//
//    if ($animator) {
//      var animate = $animator && $animator(scope, attrs);
//
//      return {
//        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
//        leave: function(element, cb) { animate.leave(element); cb(); }
//      };
//    }
//
//    return statics();
//  }
//
//  var directive = {
//    restrict: 'ECA',
//    terminal: true,
//    priority: 400,
//    transclude: 'element',
//    compile: function (tElement, tAttrs, $transclude) {
//      return function (scope, $element, attrs) {
//        console.log("d fire")
//        var previousEl, currentEl, currentScope, latestLocals,
//          onloadExp     = attrs.onload || '',
//          autoScrollExp = attrs.autoscroll,
//          renderer      = getRenderer(attrs, scope);
//
//        scope.$on('$stateChangeSuccess', function() {
//          updateView(false);
//        });
//        scope.$on('$viewContentLoading', function() {
//          updateView(false);
//        });
//
//        updateView(true);
//
//        function cleanupLastView() {
//          if (previousEl) {
//            previousEl.remove();
//            previousEl = null;
//          }
//
//          if (currentScope) {
//            currentScope.$destroy();
//            currentScope = null;
//          }
//
//          if (currentEl) {
//            renderer.leave(currentEl, function() {
//              previousEl = null;
//            });
//
//            previousEl = currentEl;
//            currentEl = null;
//          }
//        }
//
//
//        function updateView(firstTime) {
//          console.log("updateView fire", firstTime)
//          var newScope,
//            name            = extraGetUiViewName(attrs, $element.inheritedData('$uiView')),
//            previousLocals  = name && $state.$current && $state.$current.locals[name];
//
//          if (!firstTime && previousLocals === latestLocals) return; // nothing to do
//          newScope = scope.$new();
//          latestLocals = $state.$current.locals[name];
//
//          var clone = $transclude(newScope, function(clone) {
//            console.log("transclud happend")
//            renderer.enter(clone, $element, function onUiViewEnter() {
//              if(currentScope) {
//                currentScope.$emit('$viewContentAnimationEnded');
//              }
//
//              if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
//                $uiViewScroll(clone);
//              }
//            });
//            cleanupLastView();
//            console.log("transclud ended")
//
//          });
//
//          currentEl = clone;
//          currentScope = newScope;
//          /**
//           * @ngdoc event
//           * @name ui.router.state.directive:ui-view#$viewContentLoaded
//           * @eventOf ui.router.state.directive:ui-view
//           * @eventType emits on ui-view directive scope
//           * @description           *
//           * Fired once the view is **loaded**, *after* the DOM is rendered.
//           *
//           * @param {Object} event Event object.
//           */
//          currentScope.$emit('$viewContentLoaded');
//          currentScope.$eval(onloadExp);
//        }
//      };
//    }
//  };
//
//  return directive;
//}

$ExtraViewDirectiveFill.$inject = ['$compile', '$controller', '$state',   '$injector',   '$uiViewScroll'];
function $ExtraViewDirectiveFill ($compile, $controller, $state,   $injector,   $uiViewScroll) {
  function getService() {
    return ($injector.has) ? function(service) {
      return $injector.has(service) ? $injector.get(service) : null;
    } : function(service) {
      try {
        return $injector.get(service);
      } catch (e) {
        return null;
      }
    };
  }

  var service = getService(),
    $animator = service('$animator'),
    $animate = service('$animate');

  function getRenderer(attrs, scope) {
    var statics = function() {
      return {
        enter: function (element, target, cb) { target.after(element); cb(); },
        leave: function (element, cb) { element.remove(); cb(); }
      };
    };

    if ($animate) {
      return {
        enter: function(element, target, cb) { $animate.enter(element, null, target, cb); },
        leave: function(element, cb) { $animate.leave(element, cb); }
      };
    }

    if ($animator) {
      var animate = $animator && $animator(scope, attrs);

      return {
        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
        leave: function(element, cb) { animate.leave(element); cb(); }
      };
    }

    return statics();
  }


  return {
    restrict: 'ECA',
    priority: -400,
    transclude : 'element',
    compile: function (tElement,tAttrs, $transclude) {
      var initial = tElement.html();
      return function (scope, $element, attrs) {

        var previousEl, currentEl, currentScope, latestLocals,
          onloadExp     = attrs.onload || '',
          autoScrollExp = attrs.autoscroll,
          renderer      = getRenderer(attrs, scope),
          transEl,
          newScope = scope.$new()


        scope.$on('$stateChangeSuccess', function() {
          updateView(false);
        });
        scope.$on('$viewContentLoading', function() {
          updateView(false);
        });


        transEl = $transclude(newScope, function(clone) {
          $($element[0]).after( clone )
          updateView(true);
        })

        console.log( "transEl", transEl)

        function updateView( firstTime ){
          var current = $state.$current,
            name = extraGetUiViewName(attrs ),
            locals  = current && current.locals[name]

          if (! locals) {
            return;
          }

          console.log( "update view", $transEl)
          var $template = $(locals.$template),
            $transEl = $(transEl)

          if( $template.find("[data-block]").length && $template.attr('layout-origin') == $transEl.children().first().attr('layout-origin')){
            var newBlockScope = newScope.$new()

            $template.find("[data-block]").each(function(){
              var $this = $(this),
                blockName = $(this).attr('data-block'),
                $previewBlock = $transEl.find("[data-block="+blockName+"]").first()

              if( $previewBlock.attr("layout-origin") == $this.attr('layout-origin')) return

              var link = $compile( $this )

              $transEl.find("[data-block="+blockName+"]").replaceWith( $this )
              if (locals.$$controller) {
                locals.$scope = newBlockScope;
                var controller = $controller(locals.$$controller, locals);
                if (locals.$$controllerAs) {
                  newBlockScope[locals.$$controllerAs] = controller;
                }
                $this.data('$ngControllerController', controller);
                $this.children().data('$ngControllerController', controller);
              }
              link(newBlockScope)
            })

            scope.$emit('$viewContentLoaded');
            scope.$eval(onloadExp);
          }else{
            $transEl.data('$uiView', { name: name, state: locals.$$state });
            $transEl.html(locals.$template ? locals.$template : initial);
            console.log( "update view", $transEl)


            var link = $compile($element.contents());

            if (locals.$$controller) {
              locals.$scope = newScope;
              var controller = $controller(locals.$$controller, locals);
              if (locals.$$controllerAs) {
                newScope[locals.$$controllerAs] = controller;
              }
              $transEl.data('$ngControllerController', controller);
              $transEl.children().data('$ngControllerController', controller);
            }

            link(newScope);
            scope.$emit('$viewContentLoaded');
            scope.$eval(onloadExp);
          }
        }
      };
    }
  };
}

/**
 * Shared ui-view code for both directives:
 * Given attributes and inherited $uiView data, return the view's name
 */
function extraGetUiViewName(attrs, inherited) {
  var name = attrs.uiView || attrs.name || '';
  return name.indexOf('@') >= 0 ?  name :  (name + '@' + (inherited ? inherited.state.name : ''));
}
//angular.module('ui.router.state').directive('extraUiView', $ExtraViewDirective);
angular.module('ui.router.state').directive('extraUiView', $ExtraViewDirectiveFill);
