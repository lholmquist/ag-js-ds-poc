/**
    The DataSync object
    @status Experimental
    @constructs AeroGear.DataSync
    @param {Object} options
    @param {String} options.syncServerUrl - the URL of the Sync server.
    @returns {Object} The created DataSync Object
    @example
*/
AeroGear.DataSync = function( config ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.DataSync ) ) {
        return new AeroGear.DataSync( config );
    }
    // Super constructor

    AeroGear.Core.call( this );

    // Save a reference to the Pipeline Config
    this.config = config || {};
    this.lib = "DataSync";
    this.type = config ? config.type || "CouchDB" : "CouchDB";
    this.collectionName = "syncers";
    this.add( config );
    // /**
    //     Read Method
    //     @param {Object|Array} data
    //     @param {Object} settings
    //     @param {AeroGear~errorCallbackREST} [settings.error] - callback to be executed if the AJAX request results in an error
    //     @param {AeroGear~successCallbackREST} [settings.success] - callback to be executed if the AJAX request results in success
    //     @returns {Object}
    //     @example
    // */
    // this.read = function( data, settings ) {
    //     settings = settings || {};
    //     var success;
    //     success = function( data, status, jqXHR ) {
    //         if( settings.success ) {
    //             data.content = JSON.parse( data.content );
    //             settings.success.call( this, data, status, jqXHR );
    //         }
    //     };
    //     return $.ajax({
    //         url: serverUrl + "/" + data.id,
    //         contentType: "application/json",
    //         dataType: "json",
    //         type: "GET",
    //         success: success,
    //         error: settings.error
    //     });
    // };
    /**
        Save/Update Method
        @param {Object|Array} data
        @param {Object} settings
        @param {String} [settings.autoMerge = false] - if true, will auto merge the conflicting data
        @param {AeroGear~errorCallbackREST} [settings.conflict] - callback to be executed if the AJAX request results in a conflict
        @param {AeroGear~errorCallbackREST} [settings.error] - callback to be executed if the AJAX request results in an error
        @param {AeroGear~successCallbackREST} [settings.success] - callback to be executed if the AJAX request results in success
        @returns {Object}
        @example
    */
    // this.save = function( data, settings ) {
    //     settings = settings || {};
    //     var success, error, conflict, doc,
    //         that = this,
    //         id = data.id || uuid(),
    //         rev = data.rev,
    //         content = data.content || data;
    //     doc = {
    //         id: id,
    //         rev: rev,
    //         content: content
    //     };
    //     success = function( data, status, jqXHR ) {
    //         if( settings.success ) {
    //             data.content = JSON.parse( data.content );
    //             settings.success.call( this, data, status, jqXHR );
    //         }
    //     };
    //     error = function( error ) {
    //         var model = {},
    //             delta;
    //         if( error.status === 409 ) {
    //             model = error.responseJSON;
    //             model.content = JSON.parse( model.content );
    //             jsondiffpatch.config.objectHash = function(obj) { return obj.id || JSON.stringify(obj); };
    //             delta = jsondiffpatch.diff( model.content, content ); //The model returned, original content trying to get updated
    //             if( settings.autoMerge ) {
    //                 jsondiffpatch.patch( model.content, delta );
    //                 that.save( model, settings );
    //                 return;
    //             }
    //             if( settings.conflict ) {
    //                 settings.conflict.call( this, error, model, delta );
    //             }
    //         }
    //         if( settings.error ) {
    //             settings.error.apply( this, arguments );
    //         }
    //     };
    //     return $.ajax({
    //         url: serverUrl + "/" + id,
    //         contentType: "application/json",
    //         dataType: "json",
    //         data: JSON.stringify( doc ),
    //         type: "PUT",
    //         success: success,
    //         error: error
    //     });
    // };
    /**
        Remove Method
        @param {Object|Array} data
        @param {Object} settings
        @param {AeroGear~errorCallbackREST} [settings.error] - callback to be executed if the AJAX request results in an error
        @param {AeroGear~successCallbackREST} [settings.success] - callback to be executed if the AJAX request results in success
        @returns {Object}
        @example
    */
    // this.remove = function( data, settings ) {
    //     settings = settings || {};
    //     return $.ajax({
    //         url: serverUrl + "/" + data.id,
    //         contentType: "application/json",
    //         dataType: "json",
    //         data: JSON.stringify( { rev: data.rev } ),
    //         type: "DELETE",
    //         success: settings.success,
    //         error: settings.error
    //     });
    // };
};

AeroGear.DataSync.prototype = AeroGear.Core;
AeroGear.DataSync.constructor = AeroGear.DataSync;

/**
    The adapters object is provided so that adapters can be added to the AeroGear.Pipeline namespace dynamically and still be accessible to the add method
    @augments AeroGear.Pipeline
*/
AeroGear.DataSync.adapters = {};
AeroGear.DataSync.adapters.CouchDB = function( name, settings ) {

    if( !( this instanceof AeroGear.DataSync.adapters.CouchDB ) ) {
        return new AeroGear.DataSync.adapters.CouchDB( name, settings );
    }

    settings = settings || {};

    var url, open,
        dbName = settings.dbName || name,
        syncServerUrl = settings.syncServerUrl;

    url = syncServerUrl + "/" + dbName;

    this.getURL = function() {
        return url;
    };

    this.getDBName = function() {
        return dbName;
    };

    this.onChange = function() {
        if( settings.onChange ) {
            settings.onChange.apply( this, arguments );
        }
    };

    // this.getOpen = function() {
    //     return open;
    // };

    // // Need to create/"open" the database
    // AeroGear.ajax({ url: url, type: "PUT" })
    //         .then( function( response ) {
    //             console.log( response );
    //         })
    //         .then ( function( error ) {
    //             console.log( "error", error );
    //         })
    //         .catch( function( error ) {
    //             console.log( error );
    //         });
};

AeroGear.DataSync.adapters.CouchDB.prototype.fetch = function( id ) {
    var url =  this.getURL() + "/" + ( id ? id : "_all_docs" );
    return new Promise( function( resolve, reject ) {
        AeroGear.ajax({ url: url })
            .then( function( data ) {
                resolve( data.response );
            })
            .catch( function( error ) {
                console.log( error );
                reject( error );
            });
    });
};

// Call to actually do the sync
AeroGear.DataSync.adapters.CouchDB.prototype.save = function( document ) {
    var url = this.getURL() + "/" + document[ "_id" ];
    return new Promise( function( resolve, reject ) {
        AeroGear.ajax({ url: url, type: "PUT", data: JSON.stringify( document ) })
            .then( function( data ) {
                resolve( data );
            })
            .catch( function( error ) {
                if( error.status === 409 ) {
                    reject( error );
                } else {
                    reject( error );
                }
            });
    });
};

// Call to create a new Document
// AeroGear.DataSync.adapters.CouchDB.prototype.createDocument = function() {
//     return;
// };

// AeroGear.DataSync.adapters.CouchDB.prototype.updateDocument = function() {
//     return;
// };
