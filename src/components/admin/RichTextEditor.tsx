'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      const markdown = editor.getHTML()
      onChange(markdown)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-lavender-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-lavender-50 border-b border-lavender-200 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('strike') ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        <div className="w-px bg-lavender-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px bg-lavender-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('bulletList') ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('orderedList') ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px bg-lavender-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('blockquote') ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Blockquote"
        >
          " Quote
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded hover:bg-white transition-colors ${
            editor.isActive('codeBlock') ? 'bg-purple-600 text-white' : 'bg-white'
          }`}
          title="Code Block"
        >
          &lt;/&gt;
        </button>

        <div className="w-px bg-lavender-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 rounded bg-white hover:bg-lavender-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          ↶
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 rounded bg-white hover:bg-lavender-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          ↷
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
