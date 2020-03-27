import React, { Component } from 'react';

export default class RichTextEditor extends Component {
 
  render () {
    // CKEditor depends on window and therefore it cannot be initialized server-side.
    // We show a basic textarea as a fallback.
    if (typeof window === 'undefined') {
      return (
        <textarea {...this.props} />
      );
    } else {
      // Cannot import at the beginning of the file, will crash with ReferenceError: window is not defined
      const CKEditor = require('@ckeditor/ckeditor5-react');
      const ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
      return (
        <CKEditor editor={ ClassicEditor } {...this.props} />
      );
    }
  }
}