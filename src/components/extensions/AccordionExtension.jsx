import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { ChevronsUpDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Tippy from '@tippyjs/react';

const AccordionDialog = ({ isOpen, onClose, onSubmit, initialItems = null }) => {
    const [items, setItems] = useState(initialItems || [
        { title: 'Section 1', content: 'Content for section 1' },
        { title: 'Section 2', content: 'Content for section 2' }
    ]);

    const handleAddItem = () => {
        setItems([...items, { title: `Section ${items.length + 1}`, content: `Content for section ${items.length + 1}` }]);
    };

    const handleRemoveItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = () => {
        onSubmit(items);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <dialog open className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-[60vh] max-h-[80vh] flex flex-col p-6">
                <h3 className="font-bold text-xl mb-6">
                    {initialItems ? 'Edit Accordion' : 'Insert Accordion'}
                </h3>
                <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                    {items.map((item, index) => (
                        <div key={index} className="border p-5 rounded-lg bg-base-200 relative">
                            <button
                                className="btn btn-circle btn-sm absolute right-3 top-3"
                                onClick={() => handleRemoveItem(index)}
                                disabled={items.length <= 1}
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="grid grid-cols-1 gap-5 pr-8">
                                <div className="form-control w-full space-y-2">
                                    <label className="label">
                                        <span className="label-text font-medium text-base">Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="Enter title..."
                                        value={item.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full space-y-2">
                                    <label className="label">
                                        <span className="label-text font-medium text-base">Content</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered w-full h-32"
                                        placeholder="Enter content..."
                                        value={item.content}
                                        onChange={(e) => handleChange(index, 'content', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn w-full py-3 text-white bg-red-700 hover:bg-red-800 border-none" onClick={handleAddItem}>
                        <Plus size={18} className="mr-2" />
                        Add New Section
                    </button>
                </div>
                <div className="modal-action mt-6 pt-4 border-t">
                    <button className="btn btn-ghost min-w-[100px]" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none" onClick={handleSubmit}>
                        {initialItems ? 'Update' : 'Insert Accordion'}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

const AccordionComponent = ({ node, updateAttributes, editor }) => {
    const [showDialog, setShowDialog] = useState(false);
    const items = node.attrs.items || [];

    const handleEdit = () => {
        setShowDialog(true);
    };

    const handleUpdate = (newItems) => {
        updateAttributes({ items: newItems });
        setShowDialog(false);
    };

    return (
        <NodeViewWrapper className="not-prose my-4 relative group">
            <div className="flex justify-center w-full">
                <div className="join join-vertical w-[50vw] relative">
                    {editor.isEditable && (
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-base-100 shadow-sm rounded-md">
                            <button
                                onClick={handleEdit}
                                className="btn btn-sm btn-outline flex items-center gap-1"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                        </div>
                    )}
                    {items.map((item, index) => (
                        <div key={index} className="collapse collapse-arrow join-item bg-base-100 border border-base-300">
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold">
                                {item.title || `Section ${index + 1}`}
                            </div>
                            <div className="collapse-content text-sm">
                                <NodeViewContent className="prose max-w-none">
                                    {item.content || 'No content'}
                                </NodeViewContent>                          </div>
                        </div>
                    ))}
                </div>
            </div>
            {showDialog && (
                <AccordionDialog
                    isOpen={showDialog}
                    onClose={() => setShowDialog(false)}
                    onSubmit={handleUpdate}
                    initialItems={items}
                />
            )}
        </NodeViewWrapper>
    );
};

export const Accordion = Node.create({
    name: 'accordion',
    group: 'block',
    content: 'text*', // Cho phép node chứa các block khác
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            id: {
                default: () => Math.random().toString(36).substr(2, 9)
            },
            items: {
                default: [
                    { title: 'Section 1', content: 'Content for section 1' },
                    { title: 'Section 2', content: 'Content for section 2' }
                ]
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="accordion"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'accordion' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer((props) => (
            <AccordionComponent {...props} editor={this.editor} />
        ));
    },

    addCommands() {
        return {
            insertAccordion: (attributes) => ({ chain }) => {
                return chain()
                    .insertContent({
                        type: this.name,
                        attrs: attributes
                    })
                    .run();
            }
        };
    }
});

export const AccordionButton = ({ editor }) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleInsert = (items) => {
        if (editor && editor.chain) {
            console.log("Inserting accordion with items:", items);
            try {
                editor.chain().focus().insertAccordion({ items }).run();
            } catch (error) {
                console.error("Error inserting accordion:", error);
            }
        } else {
            console.error("Editor is not available");
        }
    };

    return (
        <>
            <Tippy content="Insert Accordion" placement="top">
                <button
                    onClick={() => setShowDialog(true)}
                    className="p-2 border rounded-md hover:bg-red-700 hover:text-white transition-colors"
                >
                    <ChevronsUpDown size={18} />
                </button>
            </Tippy>
            {showDialog && (
                <AccordionDialog
                    isOpen={showDialog}
                    onClose={() => setShowDialog(false)}
                    onSubmit={handleInsert}
                />
            )}
        </>
    );
};