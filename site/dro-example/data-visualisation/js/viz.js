
window.dro = window.dro || {};

dro.log = function(msg) {
	console.log(msg);
	var $log = $('#log');
	$log.text(msg + '\n' + $log.text());
	// scroll to the bottom
	$log.scrollTop($log.innerHeight);
}

////////////////////////////////////////////////////////// init field

dro.log('creating and initialising field..');
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
			[Scape.Stuff.dirt0, 2],
			[Scape.Stuff.dirt3, 4],
			[Scape.Stuff.dirt6, 6],
			[Scape.Stuff.dirt9, 0]
		]
	}
]);
dro.log('  ..field created.');

//////////////////////////////////////////////////// create the scape

dro.log('creating scene..');
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
		dro.log('displaying ' + data.name + ' [' + data.url + ']');
		var $newFrame = $('<div class="frame"><h1>' + data.name + '</h1><iframe src="' + data.url + '"></iframe></div>');
		$newFrame.height(0).prependTo($('#data')).animate({ height: '330px' }, 'slow');
	}
});
dro.log('  ..scene created.');

////////////////////////////////////////////////////////// load trees

dro.loadItems('tree', function(tree) {
	var opts = { height: tree.height2010,
		         diameter: tree.dbh2013a / 100 };
	// drop in some dendros
	if (Math.random() < 0.05) {
		opts.dendrometer = {
			clickData: { url: 'fakegraph.html?name=dendro&id=' + tree.id,
				         name: 'dendro #' + tree.id },
			name: 'dendro #' + tree.id
		};
	}
	// drop in some sap meters
	if (Math.random() < 0.05) {
		opts.sapflowmeter = {
			clickData: { url: 'fakegraph.html?name=sapflow&id=' + tree.id,
				         name: 'sap flow #' + tree.id },
			name: 'sap flow #' + tree.id
		};
	}
	return new Scape.Item(Scape.ItemTypes.tree, tree.posX, tree.posY, opts);
});

/////////////////////////////////////////////////////////// load pits

dro.loadItems('soilpit', function(thing) {
	return new Scape.Item(
		Scape.ItemTypes.soilPit,
		thing.posX, thing.posY,
		{ clickData: {
			url: 'fakegraph.html?name=soilpit&id=' + thing.id,
			name: 'soilpit #' + thing.id },
		name: 'soilpit #' + thing.id }
	);
});

////////////////////////////////////////////////// load leaf catchers

dro.loadItems('leafcatcher', function(thing) {
	return new Scape.Item(
		Scape.ItemTypes.leafLitterCatcher,
		thing.posX, thing.posY,
		{ clickData: {
			url: 'fakegraph.html?name=leafcatcher&id=' + thing.id,
			name: 'leaves #' + thing.id },
		name: 'leaves #' + thing.id }
	);
});

/////////////////////////////////////////////////////////// add crane

dro.log('adding crane..');
var craneAngle = 100;
var crane = new ScapeItem(ScapeItems.crane, 50, 50, {
		height: 47,     width: 2,
		length: 55,     rotation: craneAngle,
		camera: {
			name: 'crane camera',
			clickData: {
				name: 'crane camera',
				url: 'https://www.flickr.com/photos/jcu-dro/sets/72157647865924303/player'
			}
		}
});

dro.f.addItems([crane]);
dro.log('  ..crane added.');

// update the time div when the hour changes
var hr;
var currentHour = '';
var timeStr = '';

setInterval(function() {
	dro.f.updateItem(crane, { rotation: craneAngle });
}, 500);
