/**
 * Tiptap Blog Editor
 * 
 * Rich text editor using Tiptap for the blog feature.
 * Optimized for low-resource environments.
 * Styling uses @tailwindcss/typography (prose).
 */

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useCallback } from 'react'
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Image as ImageIcon,
    Undo,
    Redo
} from 'lucide-react'
import { Button } from '@heroui/react'

interface TiptapEditorProps {
    content: string
    onChange: (html: string) => void
    editable?: boolean
}

export function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content: content,
        editable: editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL:')
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className="border border-default-200 rounded-xl overflow-hidden bg-content1/50">
            {/* Toolbar */}
            {editable && (
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-default-200 bg-content2/50 sticky top-0 z-10">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={Bold}
                        title="Bold"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={Italic}
                        title="Italic"
                    />
                    <div className="w-px h-6 bg-default-300 mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        icon={Heading1}
                        title="Heading 1"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        icon={Heading2}
                        title="Heading 2"
                    />
                    <div className="w-px h-6 bg-default-300 mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        icon={List}
                        title="Bullet List"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        icon={ListOrdered}
                        title="Ordered List"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        icon={Quote}
                        title="Blockquote"
                    />
                    <div className="w-px h-6 bg-default-300 mx-1" />
                    <ToolbarButton
                        onClick={addImage}
                        isActive={false}
                        icon={ImageIcon}
                        title="Add Image"
                    />
                    <div className="flex-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        isActive={false}
                        icon={Undo}
                        title="Undo"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        isActive={false}
                        icon={Redo}
                        title="Redo"
                    />
                </div>
            )}

            {/* Editor Content */}
            <div className="p-4 md:p-6 min-h-[400px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

interface ToolbarButtonProps {
    onClick: () => void
    isActive: boolean
    icon: typeof Bold
    title: string
}

function ToolbarButton({ onClick, isActive, icon: Icon, title }: ToolbarButtonProps) {
    return (
        <Button
            isIconOnly
            size="sm"
            variant={isActive ? "solid" : "light"}
            color={isActive ? "primary" : "default"}
            onPress={onClick}
            title={title}
            className="w-8 h-8 min-w-8"
        >
            <Icon className="w-4 h-4" />
        </Button>
    )
}
