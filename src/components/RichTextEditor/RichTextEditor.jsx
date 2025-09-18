// RichTextEditor.js
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import 'quill/dist/quill.snow.css';
import './RichTextEditor.css';
import Quill from 'quill';

const RichTextEditor = React.forwardRef(({ value, onChange, placeholder, readOnly = false }, ref) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder,
      readOnly,
      modules: {
        toolbar: !readOnly
          ? [
              ['bold', 'italic', 'underline'],
              [{ list: 'bullet' }],
              ['clean'],
            ]
          : false,
        keyboard: {
          bindings: {
            enter: {
              key: 13,
              handler: (range, context) => {
                // Allow shift+enter for newline, or prevent if needed
                if (!context.collapsed) {
                  const delta = new delta().del(context.length);
                  editor.updateContents(delta, 'user');
                }
                const line = editor.getLine(range.index);
                if (line) {
                  const [leaf] = editor.getLeaf(range.index);
                  if (leaf && leaf.length === 1) {
                    // At start of line
                    return true;
                  }
                }
                return false;
              },
            },
          },
        },
      },
    });

    quillRef.current = editor;

    editor.on('text-change', () => {
      const content = editor.root.innerHTML;
      onChange(content);
    });

    return () => {
      quillRef.current = null;
    };
  }, [readOnly, placeholder, onChange]);

  // Sync value from outside
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
    }
  }, [value]);

  // Expose Quill instance
  useImperativeHandle(ref, () => ({
    getHTML: () => quillRef.current?.root.innerHTML || '',
    isEmpty: () => {
      const html = quillRef.current?.root.innerHTML || '';
      return !html.trim() || html === '<p><br></p>';
    },
    clear: () => {
      if (quillRef.current) {
        quillRef.current.setText('');
      }
    },
  }));

  return <div className="rich-text-editor" ref={containerRef} />;
});

export default RichTextEditor;