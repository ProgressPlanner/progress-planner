module.exports = {
	decodeEntities: ( text ) => {
		if ( typeof text !== 'string' ) {
			return text;
		}
		return text
			.replace( /&amp;/g, '&' )
			.replace( /&lt;/g, '<' )
			.replace( /&gt;/g, '>' )
			.replace( /&quot;/g, '"' )
			.replace( /&#039;/g, "'" );
	},
};
