import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React, { useRef, useEffect, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

const ResizableImageComponent = ({ node, updateAttributes, editor }) => {
    const imageRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [startWidth, setStartWidth] = useState(0);
    const [startHeight, setStartHeight] = useState(0);

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('resize-handle')) {
            setIsResizing(true);
            setStartX(e.clientX);
            setStartY(e.clientY);
            setStartWidth(imageRef.current.width);
            setStartHeight(imageRef.current.height);
            e.target.dataset.resize && e.preventDefault();
        }
    };

    const handleMouseMove = (e) => {
        if (!isResizing) return;

        const currentX = e.clientX;
        const currentY = e.clientY;
        const diffX = currentX - startX;
        const aspectRatio = startWidth / startHeight;

        // Thay đổi cả chiều rộng và cao, giữ tỷ lệ
        const newSize = Math.max(100, startWidth + diffX);
        updateAttributes({
            width: newSize,
            height: newSize / aspectRatio
        });
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <NodeViewWrapper className="relative group inline-block w-full text-center">
            <div className="relative inline-block">
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt || ''}
                    width={node.attrs.width}
                    height={node.attrs.height}
                    data-file-info={JSON.stringify(node.attrs.fileInfo)}
                    data-is-temp={node.attrs.isTemp}
                    className="block"
                />
                {editor?.isEditable && (
                    <div
                        className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 opacity-0 group-hover:opacity-50 cursor-se-resize rounded-br"
                        onMouseDown={handleMouseDown}
                    />
                )}
            </div>
        </NodeViewWrapper>
    );
};

export const ResizableImage = Node.create({
    name: 'resizableImage',
    group: 'block',
    draggable: true,
    selectable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            width: {
                default: 'auto',
            },
            height: {
                default: 'auto',
            },
            fileInfo: {
                default: null,
            },
            isTemp: {
                default: false,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'img[src]',
                getAttrs: (dom) => ({
                    src: dom.getAttribute('src'),
                    alt: dom.getAttribute('alt'),
                    width: dom.getAttribute('width') || 'auto',
                    height: dom.getAttribute('height') || 'auto',
                    fileInfo: JSON.parse(dom.getAttribute('data-file-info') || 'null'),
                    isTemp: dom.getAttribute('data-is-temp') === 'true',
                }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        console.log('HTMLAttributes: ', HTMLAttributes);
        return ['img', mergeAttributes(HTMLAttributes, {
            'data-file-info': JSON.stringify(HTMLAttributes.fileInfo),
            'data-is-temp': HTMLAttributes.isTemp ? 'true' : 'false',
        })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageComponent);
    },

    addCommands() {
        return {
            insertResizableImage: (options) => ({ chain }) => {
                return chain()
                    .insertContent({
                        type: this.name,
                        attrs: options,
                    })
                    .run();
            },
        };
    },
});