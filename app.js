var seedData = {
    id: "123456-654321",
    name: "Luke Skywalker",
    profession: "Jedi",
    hobbies: [
        {
            id: uuid.v4(),
            description: "Fighting the Dark Side"
        },
        {
            id: uuid.v4(),
            description: "going into Tosche Station to pick up some power converters"
        },
        {
            id: uuid.v4(),
            description: "Kissing his sister"
        },
        {
            id: uuid.v4(),
            description: "Bulls eyeing Womprats on his T-16"
        }
    ]
};

var app = {
    ag: {},
    currentData: {},
    updateUI: function( document ) {
        document = app.currentData = document ? document : app.currentData || {};
        var detailTemplate = $( "#detail" ).html(),
            listTemplate = $( "#hobbies" ).html();

        app.content.empty();
        app.list.empty();
        app.content.append( _.template( detailTemplate, document ) );
        app.list.append( _.template( listTemplate, document.content ) );

    },
    edit: function () {
        var $input = $( this ).closest( "li" ).addClass( "editing" ).find( ".edit" );
        var val = $input.val();

        $input.val( val ).focus();
    },
    blurOnEnter: function( e ) {
        if (e.which === app.ENTER_KEY) {
            e.target.blur();
        }
    },
    update: function() {
        var val = $.trim($(this).removeClass('editing').val()),
            id = this.id;

        if( $(this).hasClass("hobby") ) {
            app.currentData.content.hobbies = app.currentData.content.hobbies.map( function( item ) {
                if( item.id === id ) {
                    item.description = val;
                    return item;
                }
                return item;
            });
        } else {
            for( var key in app.currentData.content ) {
                if( key === id ) {
                    app.currentData.content[ key ] = val;
                    break;
                }
            }
        }

        app.ag.syncer.save( app.currentData, {
            success: function( document ) {
                console.log( "success", document );
                app.updateUI( document );
                $('.results').hide();
            },
            conflict: function( error, newModel, change ) {
                console.log( "Conflict Saving", error, newModel, change );
                app.newModel = newModel;
                app.change = change;
                app.addError.apply( this, arguments );
            },
            error: function( error ) {
                console.log( "Error Saving", error );
            }
        });
    },
    merge: function() {

        jsondiffpatch.patch( app.newModel.content, app.change );

        app.ag.syncer.save( app.newModel, {
            success: function( document ) {
                console.log( "success", document );
                app.updateUI( document );
                $('.results').hide();
            },
            conflict: function( error, newModel, change ) {
                console.log( "Conflict Saving", error, newModel, change );
                app.newModel = newModel;
                app.change = change;
                app.addError.apply( this, arguments );
            },
            error: function( error ) {
                console.log( "Error Saving", error );
            }
        });
    },
    addError: function( error, newModel, change ) {
        app.compare( newModel, app.currentData, change );
        app.updateUI();
    },
    init: function() {

        console.log( 'initing' );

        this.ENTER_KEY = 13;

        this.ag.syncer = AeroGear.DataSync({ syncServerUrl: 'http://localhost:5984/cool' });
        app.initData();

        this.content = $( "div .detail" );
        this.list = $( "#hobby-list" );

        this.content.on( "dblclick", "label", this.edit );
        this.content.on( "keypress", '.edit', this.blurOnEnter );
        this.content.on( "blur", ".edit", this.update );
        this.list.on( "dblclick", "label", this.edit );
        this.list.on( "keypress", '.edit', this.blurOnEnter );
        this.list.on( "blur", ".edit", this.update );

        $( ".merge" ).on( "click", this.merge );

        $('#showunchanged').change(function(){
            $('.jsondiffpatch-unchanged')[this.checked ? 'slideDown' : 'slideUp']();
        });

        $('.results').hide();

    },
    compare: function( json1, json2, delta ) {

        var d = jsondiffpatch.diff(json1, json2);

        if (typeof delta == 'undefined') {
            $('#jsondiff').text(JSON.stringify(d, null, 2));
            $('#jsondifflength').text(Math.round(JSON.stringify(d).length / 102.4) / 10.0);
            $('#visualdiff').empty().append(jsondiffpatch.html.diffToHtml(json1, json2, d));
            $('.jsondiff').show();
        }
        else {
            $('#jsondiff').text(JSON.stringify(delta, null, 2));
            $('#jsondifflength').text(Math.round(JSON.stringify(delta).length / 102.4) / 10.0);
            $('#visualdiff').empty().append(jsondiffpatch.html.diffToHtml(json1.content, json2.content, delta));
            $('.jsondiff').show();
        }
        $('.jsondiffpatch-unchanged')[$('#showunchanged').get(0).checked ? 'show' : 'hide']();

        $('.results').show();
    },
    initData: function() {
        // First lets check it we have the seed data in place yet

        this.ag.syncer.read( seedData, {
            success: function( document ) {
                console.log( "Document already init'd", document );
                app.updateUI( document );
            },
            error: function( error ) {
                console.log( "Can't find the document" );

                app.ag.syncer.save( seedData, {
                    success: function( document ) {
                        console.log( "success", document );
                        app.updateUI( document );
                    },
                    conflict: function( error, newModel, change ) {
                        console.log( "Conflict Saving", error, newModel, change );
                    },
                    error: function( error ) {
                        console.log( "Error Saving", error );
                    }
                });
            }
        });
    }
};

//app.init();


var sync = AeroGear.DataSync();

sync.add({ name: "cool", settings: { syncServerUrl: "http://localhost:5984/" } });

var fetchThing = sync.syncers.cool.fetch("66c635e2cd12a8057131f763ce0003eb");

var da;

function update( data ) {
    sync.syncers.cool.save( data )
        .then( function( response ) {
            console.log( response );
        }, function( error ) {
            console.log( "error" );
            console.log( error );
        });
}

fetchThing.then( function( data ) {
    console.log( data );

    da = data;
    update( data );
    //data._id = '1234567890';
});


