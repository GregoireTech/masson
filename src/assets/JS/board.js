import pathPolyfill from './path-data-polyfill';

const board = (socket, boardId) => {

pathPolyfill();
var Tools = {};

Tools.board = document.getElementById("board");
Tools.svg = document.getElementById("canvas");
Tools.socket = socket;
Tools.curTool = null;
Tools.boardName = boardId;

//Get the board as soon as the page is loaded
console.log()
Tools.socket.emit("getboard", Tools.boardName);

Tools.list = {}; // An array of all known tools. {"toolName" : {toolObject}}

Tools.add = function (newTool) {
	if (newTool.name in Tools.list) {
		console.log("Tools.add: The tool '" + newTool.name + "' is already" +
			"in the list. Updating it...");
	}

	//Add event listener for the tool's icon
	const button = document.getElementById(newTool.name);
	if(button){
		button.addEventListener('click', function(){
			Tools.change(button.id);
		});
	}

	//Format the new tool correctly
	Tools.applyHooks(Tools.toolHooks, newTool);

	//Add the tool to the list
	Tools.list[newTool.name] = newTool;

	//There may be pending messages for the tool
	var pending = Tools.pendingMessages[newTool.name];
	if (pending) {
		console.log("Drawing pending messages for '%s'.", newTool.name);
		var msg;
		while (msg = pending.shift()) {
			//Transmit the message to the tool (precising that it comes from the network)
			newTool.draw(msg, false);
		}
	}
};

Tools.change = function (toolName) {
	if (!(toolName in Tools.list)) {
		throw "Trying to select a tool that has never been added!";
	}

	var newtool = Tools.list[toolName];

	
	//There is not necessarily already a curTool
	if (Tools.curTool != null) {
		//It's useless to do anything if the new tool is already selected
		if (newtool === Tools.curTool) return;

		//Remove the old event listeners
		for (var event in Tools.curTool.compiledListeners) {
			var listener = Tools.curTool.compiledListeners[event];
			Tools.board.removeEventListener(event, listener);
		}

		//Call the callbacks of the old tool
		Tools.curTool.onquit(newtool);
	}

	//Add the new event listeners
	for (var event in newtool.compiledListeners) {
		var listener = newtool.compiledListeners[event];
		Tools.board.addEventListener(event, listener, { 'passive': false });
	}

	//Call the start callback of the new tool 
	newtool.onstart(Tools.curTool);
	Tools.curTool = newtool;
};

Tools.send = function (data, toolName) {
	toolName = toolName || Tools.curTool.name;
	var d = data;
	d.tool = toolName;
	Tools.applyHooks(Tools.messageHooks, d);
	var message = {
		"board": Tools.boardName,
		"data": d
	}
	Tools.socket.emit('broadcast', message);
};

Tools.drawAndSend = function (data) {
	Tools.curTool.draw(data, true);
	Tools.send(data);
};

//Object containing the messages that have been received before the corresponding tool
//is loaded. keys : the name of the tool, values : array of messages for this tool
Tools.pendingMessages = {};

// Send a message to the corresponding tool
function messageForTool(message) {
	var name = message.tool,
		tool = Tools.list[name];
	if (tool) {
		Tools.applyHooks(Tools.messageHooks, message);
		tool.draw(message, false);
	} else {
		///We received a message destinated to a tool that we don't have
		//So we add it to the pending messages
		if (!Tools.pendingMessages[name]) Tools.pendingMessages[name] = [message];
		else Tools.pendingMessages[name].push(message);
	}
}

// Apply the function to all arguments by batches
function batchCall(fn, args) {
	var BATCH_SIZE = 1024;
	if (args.length > 0) {
		var batch = args.slice(0, BATCH_SIZE);
		var rest = args.slice(BATCH_SIZE);
		for (var i = 0; i < batch.length; i++) fn(batch[i]);
		requestAnimationFrame(batchCall.bind(null, fn, rest));
	}
}

// Call messageForTool recursively on the message and its children
function handleMessage(message) {
	//Check if the message is in the expected format
	if (message.tool) messageForTool(message);
	if (message._children) batchCall(handleMessage, message._children);
	if (!message.tool && !message._children) {
		console.error("Received a badly formatted message (no tool). ", message);
	}
}

//Receive draw instructions from the server
Tools.socket.on("broadcast", handleMessage);



(function () {
	// Scroll and hash handling
	var scrollTimeout, lastStateUpdate = Date.now();

	window.addEventListener("scroll", function onScroll() {
		var x = window.scrollX / Tools.getScale(),
			y = window.scrollY / Tools.getScale();

		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(function updateHistory() {
			var hash = '#' + (x | 0) + ',' + (y | 0) + ',' + Tools.getScale().toFixed(1);
			if (Date.now() - lastStateUpdate > 5000 && hash !== window.location.hash) {
				window.history.pushState({}, "", hash);
				lastStateUpdate = Date.now();
			} else {
				window.history.replaceState({}, "", hash);
			}
		}, 100);
	});

	function setScrollFromHash() {
		var coords = window.location.hash.slice(1).split(',');
		var x = coords[0] | 0;
		var y = coords[1] | 0;
		var scale = parseFloat(coords[2]);
		resizeCanvas({ x: x, y: y });
		Tools.setScale(scale);
		window.scrollTo(x * scale, y * scale);
	}

	window.addEventListener("hashchange", setScrollFromHash, false);
	window.addEventListener("popstate", setScrollFromHash, false);
	window.addEventListener("DOMContentLoaded", setScrollFromHash, false);
})();

//List of hook functions that will be applied to messages before sending or drawing them
function resizeCanvas(m) {
	//Enlarge the canvas whenever something is drawn near its border
	var x = m.x | 0, y = m.y | 0
	var MAX_BOARD_SIZE = 65536; // Maximum value for any x or y on the board
	if (x > Tools.svg.width.baseVal.value - 2000) {
		Tools.svg.width.baseVal.value = Math.min(x + 2000, MAX_BOARD_SIZE);
	}
	if (y > Tools.svg.height.baseVal.value - 2000) {
		Tools.svg.height.baseVal.value = Math.min(y + 2000, MAX_BOARD_SIZE);
	}
}


Tools.messageHooks = [resizeCanvas];

Tools.scale = 1.0;
var scaleTimeout = null;
Tools.setScale = function setScale(scale) {
	if (isNaN(scale)) scale = 1;
	scale = Math.max(0.1, Math.min(10, scale));
	Tools.svg.style.willChange = 'transform';
	Tools.svg.style.transform = 'scale(' + scale + ')';
	clearTimeout(scaleTimeout);
	scaleTimeout = setTimeout(function () {
		Tools.svg.style.willChange = 'auto';
	}, 1000);
	Tools.scale = scale;
	return scale;
}
Tools.getScale = function getScale() {
	return Tools.scale;
}

//List of hook functions that will be applied to tools before adding them
Tools.toolHooks = [
	function checkToolAttributes(tool) {
		if (typeof (tool.name) !== "string") throw "A tool must have a name";
		if (typeof (tool.listeners) !== "object") {
			tool.listeners = {};
		}
		if (typeof (tool.onstart) !== "function") {
			tool.onstart = function () { };
		}
		if (typeof (tool.onquit) !== "function") {
			tool.onquit = function () { };
		}
	},
	function compileListeners(tool) {
		//compile listeners into compiledListeners
		var listeners = tool.listeners;

		//A tool may provide precompiled listeners
		var compiled = tool.compiledListeners || {};
		tool.compiledListeners = compiled;

		function compile(listener) { //closure
			const xOffset = document.getElementById('container').offsetLeft;
			const yOffset = document.getElementById('container').offsetTop;
			
			return (function listen(evt) {
				var x = (evt.pageX - xOffset)/ Tools.getScale(),
					y = (evt.pageY - yOffset )/ Tools.getScale();
				return listener(x, y, evt, false);
			});
		}

		function compileTouch(listener) { //closure
			const xOffset = document.getElementById('container').offsetLeft;
			const yOffset = document.getElementById('container').offsetTop;
			return (function touchListen(evt) {
				//Currently, we don't handle multitouch
				if (evt.changedTouches.length === 1) {
					//evt.preventDefault();
					var touch = evt.changedTouches[0];
					var x = (touch.pageX - xOffset) / Tools.getScale(),
						y = (touch.pageY - yOffset) / Tools.getScale();
					return listener(x, y, evt, true);
				}
				return true;
			});
		}

		if (listeners.press) {
			compiled["mousedown"] = compile(listeners.press);
			compiled["touchstart"] = compileTouch(listeners.press);
		}
		if (listeners.move) {
			compiled["mousemove"] = compile(listeners.move);
			compiled["touchmove"] = compileTouch(listeners.move);
		}
		if (listeners.release) {
			var release = compile(listeners.release),
				releaseTouch = compileTouch(listeners.release);
			compiled["mouseup"] = release;
			compiled["mouseleave"] = release;
			compiled["touchleave"] = releaseTouch;
			compiled["touchend"] = releaseTouch;
			compiled["touchcancel"] = releaseTouch;
		}
	}
];

Tools.applyHooks = function (hooks, object) {
	//Apply every hooks on the object
	hooks.forEach(function (hook) {
		hook(object);
	});
};


// Utility functions

Tools.generateUID = function (prefix, suffix) {
	var uid = Date.now().toString(36); //Create the uids in chronological order
	uid += (Math.round(Math.random() * 36)).toString(36); //Add a random character at the end
	if (prefix) uid = prefix + uid;
	if (suffix) uid = uid + suffix;
	return uid;
};

Tools.createSVGElement = function (name) {
	return document.createElementNS(Tools.svg.namespaceURI, name);
};

Tools.positionElement = function (elem, x, y) {
	elem.style.top = y + "px";
	elem.style.left = x + "px";
};

Tools.getColor = (function color() {
	var chooser = document.getElementById("chooseColor");
	// Init with a random color
	var clrs = ["#001f3f", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970",
		"#2ECC40", "#01FF70", "#FFDC00", "#FF851B", "#FF4136",
		"#85144b", "#F012BE", "#B10DC9", "#111111", "#AAAAAA"];
	chooser.value = clrs[Math.random() * clrs.length | 0];
	return function () { return chooser.value; };
})();

Tools.getSize = (function size() {
	var chooser = document.getElementById("chooseSize");

	function update() {
		if (chooser.value < 1 || chooser.value > 50) {
			chooser.value = 3;
		}
	}
	update();

	chooser.onchange = update;
	return function () { return chooser.value; };
})();

Tools.getOpacity = (function opacity() {
	var chooser = document.getElementById("chooseOpacity");
	return function () {
		return Math.max(0.1, Math.min(1, chooser.value));
	};
})();



//Scale the canvas on load
const globalContainer = document.getElementById('globalContainer');
Tools.svg.width.baseVal.value = globalContainer.clientWidth;
Tools.svg.height.baseVal.value = globalContainer.clientHeight;


/***********  Polyfills  ***********/
if (!window.performance || !window.performance.now) {
	window.performance = {
		"now": Date.now
	}
}
if (!Math.hypot) {
	Math.hypot = function (x, y) {
		//The true Math.hypot accepts any number of parameters
		return Math.sqrt(x * x + y * y);
	}
}


//////////////////////////////////////////////////////////////////////////////////////
/////////////////    PENCIL    ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

(function () { //Code isolation

	//Indicates the id of the line the user is currently drawing or an empty string while the user is not drawing
	var curLineId = "",
		lastTime = performance.now(); //The time at which the last point was drawn

	//The data of the message that will be sent for every new point
	function PointMessage(x, y) {
		this.type = 'child';
		this.parent = curLineId;
		this.x = x;
		this.y = y;
	}

	function startLine(x, y, evt) {

		//Prevent the press from being interpreted by the browser
		evt.preventDefault();

		curLineId = Tools.generateUID("l"); //"l" for line

		Tools.drawAndSend({
			'type': 'line',
			'id': curLineId,
			'color': Tools.getColor(),
			'size': Tools.getSize(),
			'opacity': Tools.getOpacity()
		});

		//Immediatly add a point to the line
		continueLine(x, y);
	}

	function continueLine(x, y, evt) {
		/*Wait 70ms before adding any point to the currently drawing line.
		This allows the animation to be smother*/
		if (curLineId !== "" && performance.now() - lastTime > 70) {
			Tools.drawAndSend(new PointMessage(x, y));
			lastTime = performance.now();
		}
		if (evt) evt.preventDefault();
	}

	function stopLine(x, y) {
		//Add a last point to the line
		continueLine(x, y);
		curLineId = "";
	}

	var renderingLine = {};
	function draw(data) {
		switch (data.type) {
			case "line":
				renderingLine = createLine(data);
				break;
			case "child":
				var line = (renderingLine.id === data.parent) ? renderingLine : svg.getElementById(data.parent);
				if (!line) {
					console.error("Pencil: Hmmm... I received a point of a line that has not been created (%s).", data.parent);
					line = renderingLine = createLine({ "id": data.parent }); //create a new line in order not to loose the points
				}
				addPoint(line, data.x, data.y);
				break;
			case "endline":
				//TODO?
				break;
			default:
				console.error("Pencil: Draw instruction with unknown type. ", data);
				break;
		}
	}

	function dist(x1, y1, x2, y2) {
		//Returns the distance between (x1,y1) and (x2,y2)
		return Math.hypot(x2 - x1, y2 - y1);
	}

	var pathDataCache = {};
	function getPathData(line) {
		var pathData = pathDataCache[line.id];
		if (!pathData) {
			pathData = line.getPathData();
			pathDataCache[line.id] = pathData;
		}
		return pathData;
	}

	var svg = Tools.svg;
	function addPoint(line, x, y) {
		var pts = getPathData(line), //The points that are already in the line as a PathData
			nbr = pts.length; //The number of points already in the line
		switch (nbr) {
			case 0: //The first point in the line
				//If there is no point, we have to start the line with a moveTo statement
				var	npoint = { type: "M", values: [x, y] };
				break;
			case 1: //There is only one point.
				//Draw a curve that is segment between the old point and the new one
				npoint = {
					type: "C", values: [
						pts[0].values[0], pts[0].values[1],
						x, y,
						x, y,
					]
				};
				break;
			default: //There are at least two points in the line
				//We add the new point, and smoothen the line
				var ANGULARITY = 3; //The lower this number, the smoother the line
				var prev_values = pts[nbr - 1].values; // Previous point
				var ante_values = pts[nbr - 2].values; // Point before the previous one
				var prev_x = prev_values[prev_values.length - 2];
				var prev_y = prev_values[prev_values.length - 1];
				var ante_x = ante_values[ante_values.length - 2];
				var ante_y = ante_values[ante_values.length - 1];


				//We don't want to add the same point twice consecutively
				if ((prev_x === x && prev_y === y)
					|| (ante_x === x && ante_y === y)) return;

				var vectx = x - ante_x,
					vecty = y - ante_y;
				var norm = Math.hypot(vectx, vecty);
				var dist1 = dist(ante_x, ante_y, prev_x, prev_y) / norm,
					dist2 = dist(x, y, prev_x, prev_y) / norm;
				vectx /= ANGULARITY;
				vecty /= ANGULARITY;
				//Create 2 control points around the last point
				var cx1 = prev_x - dist1 * vectx,
					cy1 = prev_y - dist1 * vecty, //First control point
					cx2 = prev_x + dist2 * vectx,
					cy2 = prev_y + dist2 * vecty; //Second control point
				prev_values[2] = cx1;
				prev_values[3] = cy1;

				npoint = {
					type: "C", values: [
						cx2, cy2,
						x, y,
						x, y,
					]
				};
		}
		pts.push(npoint);
		line.setPathData(pts);
	}

	function createLine(lineData) {
		//Creates a new line on the canvas, or update a line that already exists with new information
		var line = svg.getElementById(lineData.id) || Tools.createSVGElement("path");
		line.id = lineData.id;
		//If some data is not provided, choose default value. The line may be updated later
		line.setAttribute("stroke", lineData.color || "black");
		line.setAttribute("stroke-width", lineData.size || 10);
		line.setAttribute("opacity", Math.max(0.1, Math.min(1, lineData.opacity)) || 1);
		svg.appendChild(line);
		return line;
	}

	Tools.add({ //The new tool
		"name": "Pencil",
		"listeners": {
			"press": startLine,
			"move": continueLine,
			"release": stopLine,
		},
		"draw": draw
	});

})(); //End of code isolation


//////////////////////////////////////////////////////////////////////////////////////
/////////////////    LINE    ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

(function () { //Code isolation
	//Indicates the id of the line the user is currently drawing or an empty string while the user is not drawing
	var curLineId = "",
		lastTime = performance.now(); //The time at which the last point was drawn

	//The data of the message that will be sent for every update
	function UpdateMessage(x, y) {
		this.type = 'update';
		this.id = curLineId;
		this.x2 = x;
		this.y2 = y;
	}

	function startLine(x, y, evt) {

		//Prevent the press from being interpreted by the browser
		evt.preventDefault();

		curLineId = Tools.generateUID("s"); //"s" for straight line

		Tools.drawAndSend({
			'type': 'straight',
			'id': curLineId,
			'color': Tools.getColor(),
			'size': Tools.getSize(),
			'opacity': Tools.getOpacity(),
			'x': x,
			'y': y
		});
	}

	function continueLine(x, y, evt) {
		/*Wait 70ms before adding any point to the currently drawing line.
		This allows the animation to be smother*/
		if (curLineId !== "") {
			if (performance.now() - lastTime > 70) {
				Tools.drawAndSend(new UpdateMessage(x, y));
				lastTime = performance.now();
			} else {
				draw(new UpdateMessage(x, y));
			}
		}
		if (evt) evt.preventDefault();
	}

	function stopLine(x, y) {
		//Add a last point to the line
		continueLine(x, y);
		curLineId = "";
	}

	function draw(data) {
		switch (data.type) {
			case "straight":
				createLine(data);
				break;
			case "update":
				var line = svg.getElementById(data['id']);
				if (!line) {
					console.error("Straight line: Hmmm... I received a point of a line that has not been created (%s).", data['id']);
					createLine({ //create a new line in order not to loose the points
						"id": data['id'],
						"x": data['x2'],
						"y": data['y2']
					});
				}
				updateLine(line, data);
				break;
			default:
				console.error("Straight Line: Draw instruction with unknown type. ", data);
				break;
		}
	}

	var svg = Tools.svg;
	function createLine(lineData) {
		//Creates a new line on the canvas, or update a line that already exists with new information
		var line = svg.getElementById(lineData.id) || Tools.createSVGElement("line");
		line.id = lineData.id;
		line.x1.baseVal.value = lineData['x'];
		line.y1.baseVal.value = lineData['y'];
		line.x2.baseVal.value = lineData['x2'] || lineData['x'];
		line.y2.baseVal.value = lineData['y2'] || lineData['y'];
		//If some data is not provided, choose default value. The line may be updated later
		line.setAttribute("stroke", lineData.color || "black");
		line.setAttribute("stroke-width", lineData.size || 10);
		line.setAttribute("opacity", Math.max(0.1, Math.min(1, lineData.opacity)) || 1);
		svg.appendChild(line);
		return line;
	}

	function updateLine(line, data) {
		line.x2.baseVal.value = data['x2'];
		line.y2.baseVal.value = data['y2'];
	}

	Tools.add({ //The new tool
		"name": "Straight line",
		"listeners": {
			"press": startLine,
			"move": continueLine,
			"release": stopLine,
		},
		"draw": draw
	});

})(); //End of code isolation



//////////////////////////////////////////////////////////////////////////////////////
/////////////////    RECTANGLE    ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

(function () { //Code isolation
	//Indicates the id of the shape the user is currently drawing or an empty string while the user is not drawing
	var curId = "",
		curUpdate = { //The data of the message that will be sent for every new point
			'type': 'update',
			'id': "",
			'x': 0,
			'y': 0,
			'x2': 0,
			'y2': 0
		},
		lastTime = performance.now(); //The time at which the last point was drawn

	function start(x, y, evt) {

		//Prevent the press from being interpreted by the browser
		evt.preventDefault();

		curId = Tools.generateUID("r"); //"r" for rectangle

		Tools.drawAndSend({
			'type': 'rect',
			'id': curId,
			'color': Tools.getColor(),
			'size': Tools.getSize(),
			'opacity': Tools.getOpacity(),
			'x': x,
			'y': y,
			'x2': x,
			'y2': y
		});

		curUpdate.id = curId;
		curUpdate.x = x;
		curUpdate.y = y;
	}

	function move(x, y, evt) {
		/*Wait 70ms before adding any point to the currently drawing shape.
		This allows the animation to be smother*/
		if (curId !== "") {
			curUpdate['x2'] = x; curUpdate['y2'] = y;
			if (performance.now() - lastTime > 70) {
				Tools.drawAndSend(curUpdate);
				lastTime = performance.now();
			} else {
				draw(curUpdate);
			}
		}
		if (evt) evt.preventDefault();
	}

	function stop(x, y) {
		//Add a last point to the shape
		move(x, y);
		curId = "";
	}

	function draw(data) {
		switch (data.type) {
			case "rect":
				createShape(data);
				break;
			case "update":
				var shape = svg.getElementById(data['id']);
				if (!shape) {
					console.error("Straight shape: Hmmm... I received a point of a rect that has not been created (%s).", data['id']);
					createShape({ //create a new shape in order not to loose the points
						"id": data['id'],
						"x": data['x2'],
						"y": data['y2']
					});
				}
				updateShape(shape, data);
				break;
			default:
				console.error("Straight shape: Draw instruction with unknown type. ", data);
				break;
		}
	}

	var svg = Tools.svg;
	function createShape(data) {
		//Creates a new shape on the canvas, or update a shape that already exists with new information
		var shape = svg.getElementById(data.id) || Tools.createSVGElement("rect");
		shape.id = data.id;
		updateShape(shape, data);
		//If some data is not provided, choose default value. The shape may be updated later
		shape.setAttribute("stroke", data.color || "black");
		shape.setAttribute("stroke-width", data.size || 10);
		shape.setAttribute("opacity", Math.max(0.1, Math.min(1, data.opacity)) || 1);
		svg.appendChild(shape);
		return shape;
	}

	function updateShape(shape, data) {
		shape.x.baseVal.value = Math.min(data['x2'], data['x']);
		shape.y.baseVal.value = Math.min(data['y2'], data['y']);
		shape.width.baseVal.value = Math.abs(data['x2'] - data['x']);
		shape.height.baseVal.value = Math.abs(data['y2'] - data['y']);
	}

	Tools.add({ //The new tool
		"name": "Rectangle",
		"listeners": {
			"press": start,
			"move": move,
			"release": stop,
		},
		"draw": draw
	});

})(); //End of code isolation



//////////////////////////////////////////////////////////////////////////////////////
/////////////////    ERASER    ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

(function eraser() { //Code isolation

	var erasing = false;

	function startErasing(x, y, evt) {
		//Prevent the press from being interpreted by the browser
		evt.preventDefault();
		erasing = true;
		erase(x, y, evt);
	}

	var msg = {
		"type": "delete",
		"id": ""
	};
	function erase(x, y, evt) {
		// evt.target should be the element over which the mouse is...
		var target = evt.target;
		if (evt.type === "touchmove") {
			// ... the target of touchmove events is the element that was initially touched,
			// not the one **currently** being touched
			var touch = evt.touches[0];
			target = document.elementFromPoint(touch.clientX, touch.clientY);
		}
		if (erasing && target !== Tools.svg) {
			msg.id = target.id;
			Tools.drawAndSend(msg);
		}
	}

	function stopErasing() {
		erasing = false;
	}

	function draw(data) {
		var elem;
		switch (data.type) {
			//TODO: add the ability to erase only some points in a line
			case "delete":
				elem = svg.getElementById(data.id);
				if (elem === null) console.error("Eraser: Tried to delete an element that does not exist.");
				else svg.removeChild(elem);
				break;
			default:
				console.error("Eraser: 'delete' instruction with unknown type. ", data);
				break;
		}
	}

	var svg = Tools.svg;

	Tools.add({ //The new tool
		"name": "Eraser",
		"listeners": {
			"press": startErasing,
			"move": erase,
			"release": stopErasing,
		},
		"draw": draw
	});

})(); //End of code isolation



//////////////////////////////////////////////////////////////////////////////////////
/////////////////    TEXT    ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

(function () { //Code isolation
	var board = Tools.board, svg = Tools.svg;

	var input = document.createElement("input");
	input.id = "textToolInput";
	input.setAttribute("autocomplete", "off");

	var curText = {
		"x": 0,
		"y": 0,
		"size": 0,
		"opacity": 1,
		"color": "#000",
		"id": 0,
		"sentText": "",
		"lastSending": 0
	};

	function clickHandler(x, y, evt) {
		if (evt.target === input) return;
		if (evt.target.tagName === "text") {
			editOldText(evt.target);
			evt.preventDefault();
			return;
		}
		curText.size = parseInt(Tools.getSize() * 1.5 + 12);
		curText.opacity = Tools.getOpacity();
		curText.color = Tools.getColor();
		curText.x = x;
		curText.y = y + curText.size / 2;

		drawCurText();
		evt.preventDefault();
	}

	function editOldText(elem) {
		curText.id = elem.id;
		curText.x = elem.x.baseVal[0].value;
		curText.y = elem.y.baseVal[0].value;
		curText.size = parseInt(elem.getAttribute("font-size"));
		curText.opacity = parseFloat(elem.getAttribute("opacity"));
		curText.color = elem.getAttribute("fill");
		startEdit();
		input.value = elem.textContent;
	}

	function drawCurText() {
		stopEdit();
		//If the user clicked where there was no text, then create a new text field
		curText.id = Tools.generateUID("t"); //"t" for text
		Tools.drawAndSend({
			'type': 'new',
			'id': curText.id,
			'color': curText.color,
			'size': curText.size,
			'opacity': curText.opacity,
			'x': curText.x,
			'y': curText.y
		});
		startEdit();
	}

	function startEdit() {
		if (!input.parentNode) board.appendChild(input);
		input.value = "";
		input.focus();
		input.addEventListener("keyup", textChangeHandler);
		input.addEventListener("blur", textChangeHandler);
	}

	function stopEdit() {
		input.blur();
		input.removeEventListener("keyup", textChangeHandler);
	}

	function textChangeHandler(evt) {
		if (evt.which === 13) {
			curText.y += 1.5 * curText.size;
			return drawCurText();
		}
		if (performance.now() - curText.lastSending > 100) {
			if (curText.sentText !== input.value) {
				Tools.drawAndSend({
					'type': "update",
					'id': curText.id,
					'txt': input.value.slice(0, 280)
				});
				curText.sentText = input.value;
				curText.lastSending = performance.now();
			}
		} else {
			clearTimeout(curText.timeout);
			curText.timeout = setTimeout(textChangeHandler, 500, evt);
		}
	}

	function draw(data, isLocal) {
		switch (data.type) {
			case "new":
				createTextField(data);
				break;
			case "update":
				var textField = document.getElementById(data.id);
				if (textField === null) {
					console.error("Text: Hmmm... I received text that belongs to an unknown text field");
					return false;
				}
				updateText(textField, data.txt);
				break;
			default:
				console.error("Text: Draw instruction with unknown type. ", data);
				break;
		}
	}

	function updateText(textField, text) {
		textField.textContent = text;
	}

	function createTextField(fieldData) {
		var elem = Tools.createSVGElement("text");
		elem.id = fieldData.id;
		elem.setAttribute("x", fieldData.x);
		elem.setAttribute("y", fieldData.y);
		elem.setAttribute("font-size", fieldData.size);
		elem.setAttribute("fill", fieldData.color);
		elem.setAttribute("opacity", Math.max(0.1, Math.min(1, fieldData.opacity)) || 1);
		if (fieldData.txt) elem.textContent = fieldData.txt;
		svg.appendChild(elem);
		return elem;
	}

	Tools.add({ //The new tool
		"name": "Text",
		"listeners": {
			"press": clickHandler,
		},
		"draw": draw
	});

})(); //End of code isolation



//////////////////////////////////////////////////////////////////////////////////////
/////////////////    PENCIL    ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////







}

export default board;
/**
 What does a "tool" object look like?
 newtool = {
 	"name" : "SuperTool",
 	"listeners" : {
 		"press" : function(x,y,evt){...},
 		"move" : function(x,y,evt){...},
  		"release" : function(x,y,evt){...},
 	},
 	"draw" : function(data, isLocal){
 		//Print the data on Tools.svg
 	},
 	"onstart" : function(oldTool){...},
 	"onquit" : function(newTool){...},
 	"stylesheet" : "style.css",
}
*/
