
/**
 * Tree manipulation module based on Chandler's method described at http://www.google.com/patents/US6480857
 * 
 * This method offers a good compromise between read and write performance. Outline numbers to calculate and make it possible to retrieve subtrees in one query.
 * The weakness relies on the sorting. The method requires a composite index on the outline numbers and thus limits de facto the depth of the tree.
 * To work around this issue, it could be possible to forge an additional field to sort the tree (like the outline path "001.003.001" which limits the count of children to 999)
 * or an incremental preorder index which is more expensive to calculate/update.
 * 
 * @author	Etienne Dodat
 * @since 	01/12/2012
 * @version	unfinished draft (see TODOs)
 */


////////////////////
// INITIALIZATION //
////////////////////

var mongo = require('mongo.js')
,	db = mongo.db;
var utils = require('utils.js');


/////////////
// PRIVATE //
/////////////

function getOutline(nodeId, callback){
	if (nodeId == 0) {
		callback(null, []);
	} else {
		// find parent node and return outline
		db.test.findOne({_id:utils.toId(nodeId)}, {outline:1}, function(err, node){
			if (err) callback(err);
			else if (!node) callback(new Error('getOutline: Node not found'));
			else if (!node.outline) callback(new Error('getOutline: Node outline not found'));
			else {
				callback(null, node.outline);
			}
		});
	}
}

function getSubtreeWithOutline(outline, callback){
	var query = {};
	if (outline.length > 0){
		outline.forEach(function(number, index){
			query['outline.'+index] = number;
		});
	}
	//TODO sorting
	//see file comments
	db.test.find(query, function(err, nodes){
		if (err) callback(err);
		else if (nodes.length==0) callback(new Error('getSubtreeWithOutline: Nodes not found'));
		else {
			callback(null, nodes);
		}
	});
}

function getSubtree(nodeId, callback){
	getOutline(nodeId, function(err, outline){
		if (err) callback(err);
		else {
			getSubtreeWithOutline(outline, function(err, nodes){
				if (err) callback(err);
				else {
					callback(null, nodes);
				}
			});
		}
	});
}

function countDescendantsWithOutline(outline, callback){
	var query = {};
	if (outline.length > 0){
		outline.forEach(function(number, index){
			query['outline.'+index] = number;
		});
	}
	query['outline.'+outline.length] = {$gt:0};
	db.test.find(query).count(function(err, count){
		if (err) callback(err);
		else callback(null, count);
	});
}

function countDescendants(nodeId, callback){
	getOutline(nodeId, function(err, outline){
		if (err) callback(err);
		else {
			countDescendantsWithOutline(outline, function(err, count){
				if (err) callback(err);
				else {
					callback(null, count);
				}
			});
		}
	});
	
}

function deleteSubtreeWithOutline(outline, callback){
	var query = {};
	if (outline.length > 0){
		outline.forEach(function(number, index){
			query['outline.'+index] = number;
		});
	}
	db.test.remove(query, function(err){
		if (err) callback(err);
		else callback(null);
	});
}

function deleteSubtree(nodeId, callback){
	getOutline(nodeId, function(err, outline){
		if (err) callback(err);
		else {
			deleteSubtreeWithOutline(outline, function(err){
				if (err) callback(err);
				else callback(null);
			});
		}
	});
}

function shiftSiblings(parentOutline, position, inc, callback){
	var query = { $atomic:1 }; // $atomic isolation operator isolates a write operation that affect multiple documents from other write operations.
	if (parentOutline.length > 0){
		parentOutline.forEach(function(number, index){
			query['outline.'+index] = number;
		});
	}
	query['outline.'+parentOutline.length] = {$gte:position};
	
	var update = {$inc : {}};
	update['$inc']['outline.'+parentOutline.length] = inc;

	db.test.update(query, update, {multi:true}, function(err){
		if (err) callback(err);
		else {
			callback(null);
		}
	});
}

function moveSubtreeWithOutline(outline, parentOutline, position, callback){
	var query = { $atomic:1 }; // $atomic isolation operator isolates a write operation that affect multiple documents from other write operations.
	outline.forEach(function(number, index){
		query['outline.'+index] = number;
	});

	var update = {};
	//TODO renumber all nodes in the moved subtree (depth may have changed)

	db.test.update(query, update, {multi:true}, function(err){
		if (err) callback(err);
		else {
			callback(null);
		}
	});
}

function moveSubtree(nodeId, parentOutline, position, callback){
	getOutline(nodeId, function(err, outline){
		if (err) callback(err);
		else {
			moveSubtreeWithOutline(outline, parentOutline, position, function(err){
				if (err) callback(err);
				else callback(null);
			});
		}
	});

}

function repositionSubtreeWithOutline(outline, position, callback){
	var query = { $atomic:1 }; // $atomic isolation operator isolates a write operation that affect multiple documents from other write operations.
	outline.forEach(function(number, index){
		query['outline.'+index] = number;
	});

	var update = {$set : {}};
	update['$set']['outline.'+(outline.length-1)] = position;

	db.test.update(query, update, {multi:true}, function(err){
		if (err) callback(err);
		else {
			callback(null);
		}
	});
}

function repositionSubtree(nodeId, position, callback){
	getOutline(nodeId, function(err, outline){
		if (err) callback(err);
		else {
			repositionSubtreeWithOutline(outline, position, function(err){
				if (err) callback(err);
				else callback(null);
			});
		}
	});

}

////////////
// PUBLIC //
////////////

module.exports = {
		
		// CREATE A NODE
		createNode : function (node, parentId, position, callback) {
			if (!position) position = 1;
			
			// get parent node outline
			getOutline(parentId, function(err, outline){
				if (err) callback(err);
				else {
					// shift siblings nodes to the right
					shiftSiblings(outline, position, 1, function(err){
						if (err) callback(err);
						else {
							outline.push(position);
							node.outline = outline;
							// insert node
							db.test.save(node, function(err, node){
								if (err) callback(err);
								else {
									callback(null, node);
								}
							});
						}
					});
				}
			});
			
		},
		
		// DELETE A NODE AND CHILDREN
		deleteNode : function (nodeId, callback){
			
			deleteSubtree(nodeId, function(err){
				if (err) callback(err);
				else {
					callback(null);
				}
			});
			
		},
		
		// REPOSITION A NODE (PARENT UNCHANGED)
		repositionNode : function (nodeId, parentId, position, callback){
			if (!position) position = 1;
			
			// get node outline
			getOutline(nodeId, function(err, outline){
				if (err) callback(err);
				else {
//					// count descendants of moved node
//					countDescendantsWithOutline(outline, function(err, count){
//						if (err) callback(err);
//						else {
							// shift siblings nodes to the right
							var parentOutline = utils.copyArray(outline);
							parentOutline.pop();
							shiftSiblings(parentOutline, position, 1, function(err){
								if (err) callback(err);
								else {
									// reposition subtree
									repositionSubtree(nodeId, position, function(err){
										if (err) callback(err);
										else {
											callback(null);
										}
									});
								}
							});
//						}
//					});				
				}
			});
			
		},

		// MOVE A NODE (PARENT CHANGED)
		moveNode : function (nodeId, parentId, position, callback){
			if (!position) position = 1;
			
			// get parent node outline
			getOutline(parentId, function(err, parentOutline){
				if (err) callback(err);
				else {
					// get node outline
					getOutline(nodeId, function(err, outline){
						if (err) callback(err);
						else {
//							// count descendants of moved node
//							countDescendantsWithOutline(outline, function(err, count){
//								if (err) callback(err);
//								else {
									// shift siblings nodes to the right
									shiftSiblings(parentOutline, position, 1, function(err){
										if (err) callback(err);
										else {
											// move subtree
											moveSubtreeWithOutline(outline, parentOutline, position, function(err){
												if (err) callback(err);
												else {
													callback(null);
												}
											});
										}
									});
//								}
//							});				
						}
					});
				}
			});
			
		},
		
		// DISPLAY A (SUB)TREE ON THE CONSOLE
		display : function (parentId) {
			getSubtree(parentId, function(err, nodes){
				if (err) console.log('display:',err);
				else {
					nodes.forEach(function(node){
						console.log(node.outline+' : '+node.name+' ('+node._id+')');
					});
				}
			});
		}
		
};


////////////////
// UNIT TESTS //
////////////////

if (require.main === module){
	console.log('Starting unit tests...');
	console.log('Press Ctrl-C to exit.');	
	console.log('----------------------');
	//var assert = require('assert');	
	//assert(/*condition*/, 'Message if condition is false');
	

	db.test.drop();
	
	module.exports.createNode({name:'a'}, 0, 1, function(err, nodeA){
		if (err) console.log(err);
		else {
			module.exports.createNode({name:'c'}, 0, 2, function(err, nodeC){
				if (err) console.log(err);
				else {
					module.exports.createNode({name:'d'}, nodeC._id, 1, function(err, nodeD){
						if (err) console.log(err);
						else {
							module.exports.createNode({name:'b'}, 0, 2, function(err, nodeB){
								if (err) console.log(err);
								else {
									module.exports.createNode({name:'f'}, nodeD._id, 1, function(err, nodeF){
										if (err) console.log(err);
										else {
											module.exports.createNode({name:'e'}, nodeD._id, 1, function(err, nodeE){
												if (err) console.log(err);
												else {
													module.exports.repositionNode(nodeC._id, 0, 2, function(err){
														if (err) console.log(err);
														else {
															module.exports.repositionNode(nodeB._id, 0, 2, function(err){
																if (err) console.log(err);
																else {
																	module.exports.display(0);
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
	
}