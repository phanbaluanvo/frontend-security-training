import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import TiptapBold from '@tiptap/extension-bold';
import TiptapItalic from '@tiptap/extension-italic';
import TiptapUnderline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, Underline, Heading as HeadingIcon, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Image as ImageIcon, List, ListOrdered, Redo, Undo, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Code, Quote, ChevronDown } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ToolButton = ({ onClick, isActive, icon: Icon, label, disabled }) => (
    <Tippy content={label} placement="top">
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 border rounded-md ${isActive ? 'bg-gray-300' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Icon size={18} />
        </button>
    </Tippy>
);

const TextEditor = ({ content, onContentChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const editor = useEditor({
        extensions: [
            TiptapBold,
            Document,
            Text,
            Paragraph,
            Image,
            TiptapItalic,
            TiptapUnderline,
            History,
            Blockquote,
            CodeBlock,
            BulletList,
            OrderedList,
            ListItem,
            Heading,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link,
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            onContentChange(JSON.stringify(editor.getJSON()));
        },
    });

    const addImage = () => {
        const url = prompt('Nhập URL hình ảnh:');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const url = prompt('Nhập URL liên kết:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    if (!editor) {
        return <p>Loading Editor...</p>;
    }

    const headingLevels = [
        { level: 1, icon: Heading1, label: 'Heading 1' },
        { level: 2, icon: Heading2, label: 'Heading 2' },
        { level: 3, icon: Heading3, label: 'Heading 3' },
        { level: 4, icon: Heading4, label: 'Heading 4' },
        { level: 5, icon: Heading5, label: 'Heading 5' },
        { level: 6, icon: Heading6, label: 'Heading 6' },
    ];

    return (
        <div className="border p-4 rounded-lg shadow-md w-full mx-auto">
            {/* Toolbar */}
            <div className="flex gap-2 mb-2 flex-wrap border-b pb-2 relative">
                <ToolButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} label="Undo" />
                <ToolButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} label="Redo" />
                <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} label="Bold" />
                <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} label="Italic" />
                <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={Underline} label="Underline" />

                {/* Heading Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="p-2 border rounded-md flex items-center gap-1"
                    >
                        <HeadingIcon size={18} />
                        <ChevronDown size={14} />
                    </button>
                    {showDropdown && (
                        <div className="absolute left-0 mt-1 bg-white border rounded-md shadow-md w-40 z-10">
                            {headingLevels.map(({ level, icon: Icon, label }) => (
                                <button
                                    key={level}
                                    onClick={() => {
                                        editor.chain().focus().toggleHeading({ level }).run();
                                        setShowDropdown(false);
                                    }}
                                    className={`flex items-center gap-2 p-2 w-full rounded-lg hover:bg-gray-100 ${editor.isActive('heading', { level }) ? 'bg-gray-200' : ''}`}
                                >
                                    <Icon size={18} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} label="Blockquote" />
                <ToolButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} label="Code Block" />
                <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} label="Bullet List" />
                <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} label="Ordered List" />
                <ToolButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} label="Align Left" />
                <ToolButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} label="Align Center" />
                <ToolButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} label="Align Right" />
                <ToolButton onClick={addImage} icon={ImageIcon} label="Insert Image" />
                <ToolButton onClick={addLink} icon={LinkIcon} label="Insert Link" />
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="border rounded p-2 min-h-[40vh] editor-container" onClick={() => editor?.commands.focus()} />
        </div>
    );
};

export default TextEditor;
