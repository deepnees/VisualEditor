/**
 * VisualEditor data model BreakNode class.
 *
 * @copyright 2011-2012 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * DataModel node for a line break.
 *
 * @class
 * @constructor
 * @extends {ve.dm.LeafNode}
 * @param {Integer} [length] Length of content data in document
 * @param {Object} [attributes] Reference to map of attribute key/value pairs
 * @param {Object} [internal] Reference to internal data object
 */
ve.dm.BreakNode = function ( length, attributes, internal ) {
	// Inheritance
	ve.dm.LeafNode.call( this, 'break', 0, attributes, internal );
};

/* Static Members */

/**
 * Node rules.
 *
 * @see ve.dm.NodeFactory
 * @static
 * @member
 */
ve.dm.BreakNode.rules = {
	'isWrapped': true,
	'isContent': true,
	'canContainContent': false,
	'childNodeTypes': [],
	'parentNodeTypes': null
};

/**
 * Node converters.
 *
 * @see {ve.dm.Converter}
 * @static
 * @member
 */
ve.dm.BreakNode.converters = {
	'domElementTypes': ['br'],
	'toDomElement': function ( type, element ) {
		return document.createElement( 'br' );
	},
	'toDataElement': function ( tag, element ) {
		return { 'type': 'break' };
	}
};

/* Registration */

ve.dm.nodeFactory.register( 'break', ve.dm.BreakNode );

/* Inheritance */

ve.extendClass( ve.dm.BreakNode, ve.dm.LeafNode );
