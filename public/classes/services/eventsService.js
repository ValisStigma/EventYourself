define([], function(){
	'use strict';

	var eventsService = function($http, ConfigService, $q) {
		Array.prototype.isEmpty = function () { return this.length == 0; };

		var events = [],
			getAPI_URL = ConfigService.requestUrlCreator('api');

		var DataFetcher = function ( url, options ) {
			$http.get(url)
				.success( options.success )
				.error( options.error );
		};

		var fetchAllEvents = function ( options) { DataFetcher(getAPI_URL('events'), options); };

		var fetchEventById = function ( id, options ) { DataFetcher(getAPI_URL('events/' + id), options); };

		var findEventByIdLocal = function ( id , options ) {
			var foundEvent = false;
			events.forEach(function(event) { if ( event._id == id ) foundEvent = event; });
			if( options ) {
				if(foundEvent && options.success) options.success( foundEvent );
				else if(!foundEvent && options.error) options.error( "Event nicht gefunden" );
			}

			return foundEvent;
		};

		var getAll = function () {
			var def = $q.defer(),
				defOptions = {
					success: function ( data ) { def.resolve( events = data.events ) },
					error: function ( data ) { def.reject( data ); }};

			events.isEmpty() ? fetchAllEvents(defOptions) : def.resolve(events);
			return def.promise;
		};

		var getEventById = function (id) {
			var def = $q.defer(),
				deferOptions = {
					success: function ( event ) { def.resolve( event ) },
					error: function ( errorMsg ) { def.reject( errorMsg ) }
				};

			events.isEmpty() ? fetchEventById(id, deferOptions) : findEventByIdLocal(id, deferOptions);

			return def.promise;
		};

		var addCommentToEventLocal = function ( eventID, comment ) {
			var localEvent = findEventByIdLocal(eventID),
				index = events.indexOf(localEvent);
			if(!events[index].comments) {
				//events[index].comments = [];
			}
			//events[index].comments.push( comment );
			return comment;
		};

		var createComment = function ( eventID, comment ) {
			var def = $q.defer();

			$http.post(getAPI_URL('events/' + eventID +'/comments'), comment).then(
				function () {
					if(events.isEmpty()) {
						getAll().then(
							function ( data ) { def.resolve( addCommentToEventLocal(eventID, comment)); },
							function ( error ) { console.log(error); def.reject( error ); }
						);
					} else {
						def.resolve(addCommentToEventLocal(eventID, comment));
					}},
				function ( error ) { def.reject( error ); }
			);

			return def.promise;
		};

		var fetchComments = function (eventId) {
			var def = $q.defer();

			$http.get(getAPI_URL('events/' + eventId + '/comments')).then(
					function (response) { def.resolve(response.data.comments);},
					function (error) {def.reject(error)}
			);
			return def.promise;
		};

		return { getAll: getAll, getEventById: getEventById, createComment: createComment, getComments: fetchComments }
	};

	eventsService.$inject = [ '$http', 'ConfigService', '$q' ];

	return eventsService;
});
