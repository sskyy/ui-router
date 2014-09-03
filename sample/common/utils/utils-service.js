angular.module('uiRouterSample.utils.service', [

])

.factory('utils', function () {
  return {
    // Util for finding an object by its 'id' property among an array
    findById: function findById(a, id) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return a[i];
      }
      return null;
    },

    // Util for returning a randomKey from a collection that also isn't the current key
    newRandomKey: function newRandomKey(coll, key, currentKey){
      var randKey;
      do {
        randKey = coll[Math.floor(coll.length * Math.random())][key];
      } while (randKey == currentKey);
      return randKey;
    }
  };
})
.provider('block',function(){
  function mergeTemplate( $layout, $partial,layoutUrl, url ){
    var $output = $layout.clone()

    $output.find('[data-block]').each(function(){
      var $this = angular.element( this )
      $this.attr('layout-origin', layoutUrl)

      var blockName = angular.element(this).attr('data-block')
      var $partialBlock = $partial.find("[data-block="+blockName+"]").first()
      if( $partialBlock  ){
        $partialBlock.attr('layout-origin', url)
        $this.replaceWith( $partialBlock )
      }
    })

    $output.attr("layout-origin", layoutUrl)
    return $output
  }


  this.blockTemplate = function( url ){
      return function( $http, $q){
        var d = $q.defer()
          console.log("tring to get")
          $http.get( url).success(function( tmp ){
            var $tmp = $(tmp)
            var layoutUrl = $tmp.attr('layout-extend')

            if( layoutUrl ){
              console.log("layout url", layoutUrl )
              $http.get( layoutUrl).success(function( layoutTmp){
                d.resolve(mergeTemplate( $(layoutTmp), $tmp, layoutUrl, url  )[0].outerHTML)
              })
            }else{
              $tmp.attr('layout-origin',url)
              d.resolve( $tmp[0].outerHTML )
            }
          }).error(function(err){
            d.reject(err)
        })
        return d.promise
      }
    }
  this.$get = function(){
      console.log("nothing from blockProvider")
    return {}
    }
    console.log( "being called",this)

  })