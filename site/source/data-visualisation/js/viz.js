
window.dro = {};

////////////////////////////////////////////////////////// init field

dro.f = new Scape.Field({
    minX:  -10, maxX: 110,
    minY:  -10, maxY: 110,
    minZ:  0, maxZ: 60,
    blocksX: 12,
    blocksY: 12,
    blocksZ: 60
});

// start off at 30m altitude
dro.f.addGroundHeights([ { x: 50, y: 50, z: 30 } ]);

// start with a normal ground stack
dro.f.addGroundStacks([{
        x:50, y: 50, stack:[
            [Scape.Stuff.leaflitter, 0.1],
            [Scape.Stuff.dirt0, 1],
            [Scape.Stuff.dirt4, 1],
            [Scape.Stuff.dirt9, 0]
        ]
    }
]);


// f.addGroundHeights([
//     { x: 10, y:  40, z: 40 },
//     { x: 10, y:  40, z: 10 },
//     { x: 50, y:  20, z: 20 },
//     { x: 70, y:  15, z: 30 },
//     { x: 90, y:  40, z: 20 },
//     { x: 99, y:  49, z: 30 },
//     { x: 90, y:  40, z: 20 }
// ]);


// f.addGroundStacks([{
//         x: 10, y: 40, stack:[
//             [Scape.Stuff.leaflitter, 3],
//             [Scape.Stuff.dirt0, 3.5],
//             [Scape.Stuff.dirt4, 2],
//             [Scape.Stuff.dirt9, 2],
//             [Scape.Stuff.water, 0]
//         ]
//     },{
//         x: 90, y: 10, stack:[
//             [Scape.Stuff.leaflitter, 0.1],
//             [Scape.Stuff.dirt8, 2],
//             [Scape.Stuff.dirt5, 3],
//             [Scape.Stuff.dirt3, 0]
//         ]
//     }
// ]);

////////////////////////////////////////////////////////// load trees

$('#info').text('loading tree data...');
var loadTrees = $.getJSON('data/trees.json');
loadTrees.done( function(data) {

	var treeItems = [];
    var treeItem, treeOpts;
	$.each(data.trees, function(index, tree) {
        treeOpts = {
            height: tree.height2010,
            diameter: tree.dbh2013a / 100
        };
        if (Math.random() < 0.1) {
            treeOpts.dendrometer = 'fakegraph.html?name=dendro&id=' + tree.id;
        }
		treeItem = new Scape.Item(
			Scape.ItemTypes.tree, tree.posX, tree.posY, treeOpts
		);
		treeItems.push(treeItem);
		// setTimeout(function() { dro.f.addItems([treeItem]); }, 0);
	});
	dro.f.addItems(treeItems);

}).always( function() {
	console.log('tree loading done.');
	// turn off loading indicator
	$('#info').text('tree data loaded.');
});

/////////////////////////////////////////////////////////// add crane

var craneAngle = 100;
var crane = new ScapeItem(ScapeItems.crane, 50, 50, {
        height: 47,     width: 2,
        length: 55,     rotation: craneAngle,
        camera: 'https://www.flickr.com/photos/jcu-dro/sets/72157647865924303/player'
});
dro.f.addItems([crane]);

// var stree = new ScapeItem(ScapeItems.sensorTree, 50,0, {
//         height: 20,     diameter: 3,
//         dendrometer: "some clickdata"
// });
// dro.f.addItems([stree]);


// update the time div when the hour changes
var hr;
var currentHour = '';
var timeStr = '';

//////////////////////////////////////////////////// create the scape

dro.s = new Scape.Scene(dro.f, 'scape', {
    currentDate: 'now',  // either string 'now' or a Date object
    timeRatio: 200, // how many times faster than normal?
    dateUpdate: function(date) {
        // update the time display
        hr = date.getHours();
        if (hr != currentHour) {
            timeStr = ((hr - 1) % 12 + 1) + (hr > 12 ? 'pm' : 'am');
            if (timeStr == '0am') timeStr = 'midnight'
            if (timeStr == '12am') timeStr = 'noon'
            $('#info').text(timeStr);
            currentHour = hr;
        }
        // // update the crane rotation
        craneAngle = craneAngle + 0.1;
    },
    click: function(data) {
        $('#dataframe').attr("src", data);
    }
});

getInterval(function() {
    f.updateItem(crane, { rotation: craneAngle });
}, 500);
