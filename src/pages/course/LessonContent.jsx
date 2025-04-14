import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
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
import { getLessonDetailsByCourseId } from '@/services/LessonService';
import useScrollProgress from '@/hooks/useScrollProgress';
import ProgressBar from '@/components/common/ProgressBar';

const LessonContent = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isContentReady, setIsContentReady] = useState(false);
    const { markLessonAsComplete, lessonIds, quizId } = useOutletContext();

    const progress = useScrollProgress(isContentReady);

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

    // Function to handle "Next Lesson"
    const handleNextLesson = () => {
        const currentLessonIndex = lessonIds.indexOf(Number(lessonId));
        const nextLessonId = lessonIds[currentLessonIndex + 1];

        if (nextLessonId) {
            navigate(`/learn/courses/${courseId}/lessons/${nextLessonId}`);
        }
    };

    // Function to handle "Go to Quiz"
    const handleGoToQuiz = () => {
        navigate(`/learn/courses/${courseId}/quizzes/${quizId}`);
    };

    useEffect(() => {
        // Immediately set content as not ready when lessonId changes
        setIsContentReady(false);

        const fetchLessonContent = async () => {
            try {
                setLoading(true);
                const lessonData = await getLessonDetailsByCourseId(courseId, lessonId);
                setLesson(lessonData);

                if (editor && lessonData?.content) {
                    const content = JSON.parse(lessonData.content);

                    // Trì hoãn cập nhật nội dung một chút để tránh warning flushSync
                    setTimeout(() => {
                        editor.commands.setContent(content);

                        const checkReady = () => {
                            if (editor.getHTML() !== "<p></p>" && editor.getHTML().length > 10) {
                                setTimeout(() => {
                                    setIsContentReady(true);
                                }, 150);
                            } else {
                                setTimeout(checkReady, 50);
                            }
                        };

                        checkReady();
                    }, 0);
                }

            } catch (error) {
                console.error('Error fetching lesson content:', error);
                navigate("/learn")
            } finally {
                setLoading(false);
            }
        };

        fetchLessonContent();

        return () => {
            // Make sure content is marked as not ready when unmounting
            setIsContentReady(false);
        };
    }, [lessonId, courseId, editor]);

    useEffect(() => {
        if (progress === 100) {
            markLessonAsComplete(parseInt(lessonId));
        }
    }, [progress]);

    const isLastLesson = lessonIds.indexOf(Number(lessonId)) === lessonIds.length - 1;

    return (
        <div className="p-6">
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <ProgressBar progress={progress} />
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

                    {/* Hiển thị nút Go to Quiz nếu là bài học cuối */}
                    {isLastLesson ? (
                        <div className="mt-6">
                            <button onClick={handleGoToQuiz} className="btn text-white bg-red-700 hover:bg-red-800 border-none w-full">
                                Go to Quiz
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <button onClick={handleNextLesson} className="btn text-white bg-red-700 hover:bg-red-800 border-none w-full">
                                Go to Next Lesson
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LessonContent;
