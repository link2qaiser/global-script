/**
* Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
* For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/

/* exported initSample */

if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
  CKEDITOR.tools.enableHtml5Elements( document );

// The trick to keep the editor in the sample quite small
// unless user specified own height.
CKEDITOR.config.height = 800;
CKEDITOR.config.width = 'auto';
CKEDITOR.config.allowedContent = true;

var initSample = ( function() {
  var wysiwygareaAvailable = isWysiwygareaAvailable(),
     isBBCodeBuiltIn = !!CKEDITOR.plugins.get( 'bbcode' );

  return function() {
     var editorElement = CKEDITOR.document.getById( 'excerpt-editor' );

     // :(((
     if ( isBBCodeBuiltIn ) {
        editorElement.setHtml(
           ''
        );
     }
     // Depending on the wysiwygarea plugin availability initialize classic or inline editor.
     if ( wysiwygareaAvailable ) {
        CKEDITOR.replace( 'excerpt-editor' );
     } else {
        editorElement.setAttribute( 'contenteditable', 'true' );
        CKEDITOR.inline( 'excerpt-editor' );
        // TODO we can consider displaying some info box that
        // without wysiwygarea the classic editor may not work.
     }
  };

  function isWysiwygareaAvailable() {
     // If in development mode, then the wysiwygarea must be available.
     // Split REV into two strings so builder does not replace it :D.
     if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
        return true;
     }

     return !!CKEDITOR.plugins.get( 'wysiwygarea' );
  }
} )();
initSample();