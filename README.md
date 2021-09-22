# Titanium BottomPullView CommonJS Module

An easy to use pure Titanium BottomPullView (sure could be optimized...)

Feel free to modify, improvements are always welcome!

<img src="./demo.gif" width="293" height="634" alt="Example" />


## Methods

### `createBottomPullView `

## Events

No Events for now

## Example

```js

var bottomPullViewModule = require("de.marcbender.bottompullview");


var tableRows = [];

var tableData = [ {title: 'Apples'}, {title: 'Bananas'}, {title: 'Carrots'}, {title: 'Potatoes'},{title: 'Apples'}, {title: 'Bananas'}, {title: 'Carrots'}, {title: 'Potatoes'},{title: 'Apples'}, {title: 'Bananas'}, {title: 'Carrots'}, {title: 'Potatoes'},{title: 'Apples'}, {title: 'Bananas'}, {title: 'Carrots'}, {title: 'Potatoes'},{title: 'Apples'}, {title: 'Bananas'}, {title: 'Carrots'}, {title: 'Potatoes'},{title: 'Apples'}, {title: 'Bananas'}, {title: 'Carrots'}, {title: 'Potatoes'},{title: 'Apples'}, {title: 'Bananas'}, {title: 'Carrots'}, {title: 'Potatoes'} ];

for (var j = 0; j < tableData.length; j++) {
			var rowView = Ti.UI.createView({
				top:1,
				bottom:1,
				width:Ti.UI.FILL,
				height:62,
				backgroundColor:'transparent'
			});

			var title = Ti.UI.createLabel({
				color: '#000',
				width:Ti.UI.SIZE,
				height:Ti.UI.SIZE,
				font: {
					fontFamily : 'Arial',
					fontSize: 22,
					fontWeight: 'bold'
				},
				text: tableData[j].title
			});
			rowView.add(title);

			var row = Ti.UI.createTableViewRow({
				className:'test', 
				height:60,
				backgroundColor:'transparent',
				width:Ti.UI.FILL
			});
			row.add(rowView);
			tableRows.push(row);
}




var bottomView = Ti.UI.createTableView({
	top:0,
	left:0,
	right:0,
	bottom:0,
	contentInsets:{top:0,bottom:0}, // only available with module 	"de.marcbender.tableviewextension" - available soon
	showVerticalScrollIndicator: true,
	width:Ti.UI.FILL,
	height:500,
	contentHeight:Ti.UI.SIZE,
	minRowHeight:60,
	scrollable: true,
	scrollType:'vertical',
	backgroundColor:'transparent'
});

bottomView.setData(tableRows,{animated:false});



var pullviewController = (new bottomPullViewModule()).createBottomPullView({
	backgroundColor:'#acacac',
	minPullHeight:200,
	//contentView.height must be greater than maxPullHeight
	maxPullHeight:500,
	darkenBackground:false, // if true -> a darkend backgroundView will be displayed when bottomPullView is open / up
	pullViewTopShadow:true,
	viewShadowColor:'#EE000000',
	viewShadowOffset : {
		x: 0,
		y: -1
	},
	viewShadowRadius:6,
	parentView:YOUR-PULLVIEW-CONTROLLER-parentView, // parentContainer the pullviewController is a child of
	contentView:bottomView, // content for inside the pullviewController
	contentIsScrollable:true, // if the content is a tableView, listView, or scrollView
	adjustScrollableContentInsets:true, // if the contentInsets should be automaticly 	adjusted for the scrollView,tableView - only effective when using module 	"de.marcbender.tableviewextension"
	bottomInset:0 // extra bottomInset (INTEGER) for the scrollView,tableView (depends 	on safeArea bottom) - only effective when using module 	"de.marcbender.tableviewextension"
});

WHATEVERVIEW_OR_WINDOW.add(pullviewController);
```

## License

MIT

## Author

Marc Bender
