function bottomPullView() {
}

bottomPullView.prototype.createBottomPullView = function(args) {
  return bottomPullViewInit(args);
}

var bottomPullViewInit = function(args) {
	var isOpen = false;
	var isManuallyOpen = false;
	var drawer = null;
	var pulltabContainerView = null;
	var contentView = null;
	var pulltab =  null;
	var bottomInset = 0;
	var parentView = null;
	var oldY = 0;
	var diffY = 0;
	var sx = 0;
	var sy = 0;
	var cx = 0;
	var cy = 0;
	var xDistance = 0;
	var startPos = 0;
	var diffPostition = 0;
	var oldConvertedYPos = 0;
	var actualPos = 0;
	var isAnimating = false;
	var contentViewContentInsets = null;
	var contentViewHeight = 0;


	if (args.contentView){
		contentView = args.contentView;
	}

	if (args.bottomInset){
		bottomInset = args.bottomInset;
	}
	if (args.parentView){
		parentView = args.parentView;
	}

	var topAnimation = Titanium.UI.createAnimation({
		duration:1
	});

	var darkenViewFadeout = Titanium.UI.createAnimation({
		duration:300,
		opacity:0.0,
		visible:false
	});

	var thisTransform = Titanium.UI.createMatrix2D({
	});

	function onTouchPullStart(e) {
		oldY = 0;
		sx = e.x;
		sy = e.y;
		cx = e.x;
		cy = e.y;
		var points = e.source.convertPointToView({
			x: e.x,
			y: e.y
		}, parentView);
		startPos = (points.y);
		diffPostition = 0;
		oldConvertedYPos = startPos;
	}

	function onTouchPullEnd(e) {

		if (((parentView.rect.height-oldConvertedYPos) > args.minPullHeight) && actualPos < args.maxPullHeight && actualPos > args.minPullHeight && isOpen == false && isManuallyOpen == false){
			isAnimating = true;
			isOpen = true;

			drawer.newTop = (parentView.rect.height - args.maxPullHeight);

			thisTransform = thisTransform.translate(0, ((actualPos - args.maxPullHeight)));

			actualPos = args.maxPullHeight;

			topAnimation.applyProperties({
				duration:180,
				transform:thisTransform,
				curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
			});
			drawer.animate(topAnimation,function(){
				isAnimating = false;
				isManuallyOpen = false;
			});	

			if (contentView != null && args.contentIsScrollable == true && args.adjustScrollableContentInsets && args.adjustScrollableContentInsets == true && (contentView.apiName == "Ti.UI.TableViewExtended" || contentView.apiName == "Ti.UI.ScrollViewExtended")){
				contentView.setContentInsets({
					top:0,
					bottom:contentViewContentInsets.bottom
				},{animated:false,noOffset:true});
			}


			if (args.darkenBackground == true){
				darkenView.opacity = 1.0;
				darkenView.visible = true;
			}
		}

		else {
			if (actualPos < args.maxPullHeight && actualPos >= args.minPullHeight && isOpen == true && isManuallyOpen == false){
					isAnimating = true;
					isOpen = false;
					drawer.newTop = (parentView.rect.height - args.minPullHeight);
					thisTransform = thisTransform.translate(0, (actualPos - args.minPullHeight));
					actualPos = args.minPullHeight;

		
					topAnimation.applyProperties({
							transform:thisTransform,
							duration:180,
							curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
					});
					drawer.animate(topAnimation,function(){
						isAnimating = false;
						isManuallyOpen = false;

						if (contentView != null && args.contentIsScrollable == true && args.adjustScrollableContentInsets && args.adjustScrollableContentInsets == true && (contentView.apiName == "Ti.UI.TableViewExtended" || contentView.apiName == "Ti.UI.ScrollViewExtended")){

							contentView.setContentInsets({
								top:0,
								bottom:parseInt(contentViewContentInsets.bottom + (args.maxPullHeight-args.minPullHeight))
							},{animated:false,noOffset:true});
						}
	
					});	
		
					if (args.darkenBackground == true){
						darkenView.opacity = 0.0;
						darkenView.visible = false;
					}
			}
			else {
				return false;
			}
		}
	}


	function onTouchPullCancel(e) {
	}


	function onTouchPullMove(obj,e) {
			var thispoints = obj.convertPointToView({x:e.x , y: (e.y)}, parentView);

			if ((parentView.rect.height-(thispoints.y)) <= args.minPullHeight){
				oldConvertedYPos = (thispoints.y);
				actualPos = (parentView.rect.height-(thispoints.y));
				isAnimating = false;
				isManuallyOpen = false;
				if (args.darkenBackground == true){
					darkenView.opacity = 0.0;
					darkenView.visible = false;
				}
				return false;
			}
			else if ((parentView.rect.height-(thispoints.y)) >= args.maxPullHeight){
				isManuallyOpen = true;
				isAnimating = false;
				oldConvertedYPos = (thispoints.y);
				actualPos = (parentView.rect.height-(thispoints.y));

				if (args.darkenBackground == true){
					darkenView.opacity = 1.0;
					darkenView.visible = true;
				}
				return false;
			}
			else {
				if ((thispoints.y) != oldConvertedYPos){
					isAnimating = true;
					isManuallyOpen = false;
					diffPostition =  ((thispoints.y) - oldConvertedYPos);
					oldConvertedYPos = (thispoints.y);

					actualPos = (parentView.rect.height-(thispoints.y));

					diffY = ((e.y)-oldY);

					thisTransform = thisTransform.translate(0, diffPostition);

					drawer.newTop = (thispoints.y);

					oldY = (e.y);

					topAnimation.applyProperties({
						transform:thisTransform,
						curve:7,
						duration:16
					});	

					drawer.animate(topAnimation);
				}
				else {
					return false;
				}
			}
	}

	if (contentView){
		contentViewHeight = contentView.toImage(null,false).height;
	}

	drawer = Ti.UI.createView({
		id:'pullView',
		borderRadius:16,
		left: 0,
		right: 0,
		newTop:parseInt(parentView.rect.height - args.minPullHeight),
		top:parseInt(parentView.rect.height - args.minPullHeight),
		width: Ti.UI.FILL,
		height: parseInt(contentViewHeight + 32),
		bottom: -(parseInt(parentView.rect.height - args.minPullHeight) + parseInt(contentViewHeight + 32)),
		layout: 'vertical',
		backgroundColor:(args.backgroundColor) ? args.backgroundColor : '#acacac'
	});


	if (args.pullViewTopShadow == true){
		drawer.applyProperties({
			viewShadowColor: (args.viewShadowColor) ? args.viewShadowColor : '#DD000000',
			viewShadowOffset: (args.viewShadowOffset) ? args.viewShadowOffset : {
				x: 0,
				y: -1
			},
			viewShadowRadius: (args.viewShadowRadius) ? args.viewShadowRadius : 8	
		});
	}


	pulltabContainerView = Ti.UI.createView({
		id:'pulltabContainerView',
		top: 0,
		width: Ti.UI.FILL,
		height: 32,
		backgroundColor:'transparent'
	});

	pulltab = Ti.UI.createView({
		id:'pulltab',
		center: {
			x: "50%"
		},
		width: 44,
		height: 8,
		top:12,
		borderRadius:4,
		touchEnabled:false,
		bubbleParent:true,
		backgroundColor:'#555',
		accessibilityLabel: "Drawer",
		accessibilityValue: "Closed",
		accessibilityHint: "Click to open the drawer"
	});

	pulltabContainerView.add(pulltab);

	pulltabContainerView.addEventListener('touchstart',onTouchPullStart);

	pulltabContainerView.addEventListener('touchmove', function(e){
		onTouchPullMove(this,e);
	});

	pulltabContainerView.addEventListener('touchend',onTouchPullEnd);
	pulltabContainerView.addEventListener('touchcancel',onTouchPullEnd);

	if (args.darkenBackground == true){
		var darkenView = Ti.UI.createView({
			id:'pulltabDarkenView',
			top: 0,
			left:0,
			right:0,
			backgroundColor:'#22000000',
			opacity:0.0,
			visible:false,
			bubbleParent:true,
			touchEnabled:true,
			width:Ti.UI.FILL,
			height: Ti.UI.FILL,
		});
		parentView.add(darkenView);   
	}

	drawer.add(pulltabContainerView);

	if (contentView){
		var contentViewContainer = Ti.UI.createView({
				id:'contentViewContainer',
				top: 0,
				left:3,
				right:3,
				bottom:0,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				backgroundColor:'transparent'
		});
		contentViewContainer.add(contentView);
		drawer.add(contentViewContainer);
		
		if (args.contentIsScrollable == true && (contentView.apiName == "Ti.UI.TableView" || contentView.apiName == "Ti.UI.TableViewExtended") ){
			contentViewContentInsets = contentView.contentInsets;
			contentView.addEventListener("scroll", function(e){

				if (e.contentOffset.y < -60 && isOpen == true){
					
					isAnimating = true;
					isOpen = false;
					drawer.newTop = parseInt(parentView.rect.height - args.minPullHeight);
					thisTransform = thisTransform.translate(0, parseInt(actualPos - args.minPullHeight));
				
					topAnimation.applyProperties({
							transform:thisTransform,
							duration:300,
							curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
					});
					drawer.animate(topAnimation,function(){
						isAnimating = false;
						isManuallyOpen = false;
						if ((contentView.apiName == "Ti.UI.TableViewExtended") && contentView != null && args.contentIsScrollable == true && args.adjustScrollableContentInsets && args.adjustScrollableContentInsets == true){
							contentView.setContentInsets({
								top:0,
								bottom:parseInt(contentViewContentInsets.bottom + (args.maxPullHeight-args.minPullHeight))
							},{animated:true,noOffset:true});
						}
	
					});	
		
					if (args.darkenBackground == true){
						darkenView.opacity = 0.0;
						darkenView.visible = false;
					}

				}
			});
		}
		else if (args.contentIsScrollable == true && (contentView.apiName == "Ti.UI.ScrollView" || contentView.apiName == "Ti.UI.ScrollViewExtended")){
			contentViewContentInsets = contentView.contentInsets;

			contentView.addEventListener("scroll", function(e){
				if (e.y < -60 && isOpen == true){
					
					isAnimating = true;
					isOpen = false;
					drawer.newTop = parseInt(parentView.rect.height - args.minPullHeight);
					thisTransform = thisTransform.translate(0, parseInt(actualPos - args.minPullHeight));
		
					topAnimation.applyProperties({
							transform:thisTransform,
							duration:300,
							curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
					});
					drawer.animate(topAnimation,function(){
						isAnimating = false;
						isManuallyOpen = false;

						if (contentView.apiName == "Ti.UI.ScrollViewExtended" && contentView != null && args.contentIsScrollable == true && args.adjustScrollableContentInsets && args.adjustScrollableContentInsets == true){

							contentView.setContentInsets({
								top:0,
								bottom:parseInt(contentViewContentInsets.bottom + (args.maxPullHeight-args.minPullHeight))
							},{animated:true,noOffset:true});
						}

					});	
		
					if (args.darkenBackground == true){
						darkenView.opacity = 0.0;
						darkenView.visible = false;
					}

				}
			});
		}
		else if (args.contentIsScrollable == true && contentView.apiName == "Ti.UI.ListView"){

		}
		else {
			console.log("[BOTTOMPULLVIEW] - no scrollable view type for contentView");
		}
	}
		
	return drawer;
}

module.exports = bottomPullView;