/**
 * Created by rafael on 28.11.2015.
 */
define([], function(){
    'use strict';

    var tagsService = function($http, ConfigService, $q) {
        Array.prototype.isEmpty = function () { return this.length == 0; };

        var tags = [],
            getAPI_URL = ConfigService.requestUrlCreator('api');

        var DataFetcher = function ( url, options ) {
            $http.get(url)
                .success( options.success )
                .error( options.error );
        };

        var fetchAllTags = function ( options) { DataFetcher(getAPI_URL('tags'), options); };

        var getAll = function () {
            var def = $q.defer(),
                defOptions = {
                    success: function ( data ) { def.resolve( tags = data.tags ) },
                    error: function ( data ) { def.reject( data ); }};

            tags.isEmpty() ? fetchAllTags(defOptions) : def.resolve(events);
            return def.promise;
        };

        return { getAll: getAll}
    };

    tagsService.$inject = [ '$http', 'ConfigService', '$q' ];

    return tagsService;
});
