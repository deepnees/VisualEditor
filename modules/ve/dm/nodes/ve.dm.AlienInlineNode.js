/**
 * VisualEditor data model AlienInlineNode class.
 *
 * @copyright 2011-2012 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * DataModel node for an alien inline node.
 *
 * @class
 * @constructor
 * @extends {ve.dm.LeafNode}
 * @param {Integer} [length] Length of content data in document
 * @param {Object} [attributes] Reference to map of attribute key/value pairs
 * @param {Object} [internal] Reference to internal data object
 */
ve.dm.AlienInlineNode = function ( length, attributes, internal ) {
	// Inheritance
	ve.dm.LeafNode.call( this, 'alienInline', 0, attributes, internal );
};

/* Static Members */

/**
 * Node rules.
 *
 * @see ve.dm.NodeFactory
 * @static
 * @member
 */
ve.dm.AlienInlineNode.rules = {
	'isWrapped': true,
	'isContent': true,
	'canContainContent': false,
	'childNodeTypes': [],
	'parentNodeTypes': null
};

// This is a special node, no converter registration is required
ve.dm.AlienInlineNode.converters = null;

/* Registration */

ve.dm.nodeFactory.register( 'alienInline', ve.dm.AlienInlineNode );

/* Inheritance */

ve.extendClass( ve.dm.AlienInlineNode, ve.dm.LeafNode );
