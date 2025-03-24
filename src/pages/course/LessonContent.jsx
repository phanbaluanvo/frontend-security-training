import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import Spinner from '@/components/common/Spinner';
import { Accordion } from '@/components/extensions/AccordionExtension';
import { ResizableImage } from '@/components/extensions/ResizableImage';
import { getLessonByLessonId } from '@/services/LessonService';
import { getLessonDetailsByCourseId } from '@/services/LessonService';

const LessonContent = () => {
    const { courseId, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    const editor = useEditor({
        extensions: [
            TiptapBold,
            Document,
            Text,
            Paragraph,
            ResizableImage,
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
            Accordion.configure({
                HTMLAttributes: {
                    class: 'accordion',
                },
            }),
        ],
        editable: false,
    });

    useEffect(() => {
        const fetchLessonContent = async () => {
            try {
                setLoading(true);
                const lessonData = await getLessonDetailsByCourseId(courseId, lessonId);
                setLesson(lessonData);

                // Update editor content directly after fetching
                if (editor && lessonData?.content) {
                    const content = JSON.parse(lessonData.content);
                    // Use setTimeout to defer the update
                    setTimeout(() => {
                        editor.commands.setContent(content);
                    }, 0);
                }
            } catch (error) {
                console.error('Error fetching lesson content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessonContent();

        return () => {
            if (editor) {
                editor.destroy();
            }
        };
    }, [lessonId, editor]);

    return (
        <div className="p-6">
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson?.lesson.lessonName}</h1>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Module:</span> {lesson?.lesson.module?.moduleName}
                        </div>
                    </div>

                    <EditorContent
                        editor={editor}
                        className="prose prose-lg w-full"
                    />
                </>
            )}
        </div>
    );
};

export default LessonContent;