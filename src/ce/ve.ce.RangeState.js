/*!
 * VisualEditor Content Editable Range State class
 *
 * @copyright 2011-2015 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * ContentEditable range state (a snapshot of CE selection/content state)
 *
 * @class
 *
 * @constructor
 * @param {ve.ce.RangeState|null} old Previous range state
 * @param {jQuery} $surfaceElement The CE Surface $element
 * @param {ve.ce.DocumentNode} docNode The current document node
 * @param {boolean} selectionOnly The caller promises the content has not changed from old
 */
ve.ce.RangeState = function VeCeRangeState( old, $surfaceElement, docNode, selectionOnly ) {
	/**
	 * @property {boolean} branchNodeChanged Whether the CE branch node changed
	 */
	this.branchNodeChanged = null;

	/**
	 * @property {boolean} selectionChanged Whether the DOM range changed
	 */
	this.selectionChanged = null;

	/**
	 * @property {boolean} contentChanged Whether the content changed
	 */
	this.contentChanged = null;

	/**
	 * @property {ve.Range|null} veRange The current selection range
	 */
	this.veRange = null;

	/**
	 * @property {ve.ce.BranchNode|null} node The current branch node
	 */
	this.node = null;

	/**
	 * @property {string} text Plain text of current branch node
	 */
	this.text = null;

	/**
	 * @property {string} DOM Hash of current branch node
	 */
	this.hash = null;

	this.saveState( old, $surfaceElement, docNode, selectionOnly );
};

/* Inheritance */

OO.initClass( ve.ce.RangeState );

/* Methods */

/**
 * Saves a snapshot of the current range state
 * @method
 * @param {ve.ce.RangeState|null} old Previous range state
 * @param {jQuery} $surfaceElement The CE Surface $element
 * @param {ve.ce.DocumentNode} docNode The current document node
 * @param {boolean} selectionOnly The caller promises the content has not changed from old
 */
ve.ce.RangeState.prototype.saveState = function ( old, $surfaceElement, docNode, selectionOnly ) {
	var $node, selection, anchorNodeChanged;

	// Freeze selection out of live object.
	selection = ( function ( liveSelection ) {
		return {
			focusNode: liveSelection.focusNode,
			focusOffset: liveSelection.focusOffset,
			anchorNode: liveSelection.anchorNode,
			anchorOffset: liveSelection.anchorOffset
		};
	}( docNode.getElementDocument().getSelection() ) );

	// Use a blank selection if the selection is outside this surface
	// (or if the selection is inside another surface inside this one)
	if (
		selection.rangeCount && $(
			selection.getRangeAt( 0 ).commonAncestorContainer
		).closest( '.ve-ce-surface' )[0] !== $surfaceElement[0]
	) {
		selection = {
			focusNode: null,
			focusOffset: null,
			anchorNode: null,
			anchorOffset: null
		};
	}

	// Get new range information
	if ( old && !old.compareSelection( selection ) ) {
		// No change; use old values for speed
		this.selectionChanged = false;
		this.veRange = old.veRange;
	} else {
		this.selectionChanged = true;
		this.veRange = ve.ce.veRangeFromSelection( selection );
	}

	anchorNodeChanged = !old || old.compareAnchorNode( selection );

	if ( !anchorNodeChanged ) {
		this.node = old.node;
	} else {
		$node = $( selection.anchorNode ).closest( '.ve-ce-branchNode' );
		if ( $node.length === 0 ) {
			this.node = null;
		} else {
			this.node = $node.data( 'view' );
			// Check this node belongs to our document
			if ( this.node && this.node.root !== docNode ) {
				this.node = null;
				this.veRange = null;
			}
		}
	}

	this.branchNodeChanged = ( !old || this.node !== old.node );

	// Compute text/hash, for change comparison
	if ( selectionOnly && !anchorNodeChanged ) {
		this.text = old.text;
		this.hash = old.hash;
	} else if ( this.node === null ) {
		this.text = null;
		this.hash = null;
	} else {
		this.text = ve.ce.getDomText( this.node.$element[0] );
		this.hash = ve.ce.getDomHash( this.node.$element[0] );
	}

	// Only set contentChanged if we're still in the same branch node
	this.contentChanged = (
		!selectionOnly &&
		old &&
		old.node === this.node && (
			old.hash === null ||
			old.text === null ||
			old.hash !== this.hash ||
			old.text !== this.text
		)
	);

	// Save selection for future comparisons. (But it is not properly frozen, because the nodes
	// are live and mutable, and therefore the offsets may come to point to places that are
	// misleadingly different from when the selection was saved).
	this.misleadingSelection = selection;
};

/**
 * Compare a selection object for changes from the snapshotted state.
 *
 * The meaning of "changes" is slightly misleading, because the offsets were taken
 * at two different instants, between which content outside of the selection may
 * have changed. This can in theory cause false negatives (unnoticed changes).
 *
 * @param {Object} selection Selection to compare
 * @returns {boolean} Whether there is a change
 */
ve.ce.RangeState.prototype.compareSelection = function ( selection ) {
	return (
		this.misleadingSelection.focusNode !== selection.focusNode ||
		this.misleadingSelection.focusOffset !== selection.focusOffset ||
		this.misleadingSelection.anchorNode !== selection.anchorNode ||
		this.misleadingSelection.anchorOffset !== selection.anchorOffset
	);
};

/**
 * Compare a selection object for a change of anchor node from the snapshotted state.
 *
 * @param {Object} selection Selection to compare
 * @returns {boolean} Whether the anchor node has changed
 */
ve.ce.RangeState.prototype.compareAnchorNode = function ( selection ) {
	return this.misleadingSelection.anchorNode !== selection.anchorNode;
};
