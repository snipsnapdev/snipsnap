import dynamic from 'next/dynamic';

const Editor = dynamic(import('components/shared/editor'), { ssr: false });

const EditorPage = () => <Editor />;

export default EditorPage;
