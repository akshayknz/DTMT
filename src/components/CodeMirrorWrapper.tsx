import React, { lazy, Suspense } from 'react';
import { Controlled as CodeMirrorType } from 'react-codemirror2';

type CodeMirrorComponentProps = {
  value: string;
  onBeforeChange: (editor: any, data: any, value: string) => void;
  options: {
    mode: string;
    theme: string;
    lineNumbers: boolean;
    [key: string]: any;
  };
};

const CodeMirrorComponent: React.FC<CodeMirrorComponentProps> = ({
  value,
  onBeforeChange,
  options,
}) => {
  const CodeMirror = lazy(() => import('react-codemirror2').then((module) => ({ default: module.Controlled })));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CodeMirror value={value} onBeforeChange={onBeforeChange} options={options} />
    </Suspense>
  );
};

type CodeMirrorWrapperProps = {
  value: string;
  onBeforeChange: (editor: any, data: any, value: string) => void;
  options: {
    mode: string;
    theme: string;
    lineNumbers: boolean;
    [key: string]: any;
  };
};

const CodeMirrorWrapper: React.FC<CodeMirrorWrapperProps> = ({ value, onBeforeChange, options }) => {
  return (
    <CodeMirrorComponent value={value} onBeforeChange={onBeforeChange} options={options} />
  );
};

export default CodeMirrorWrapper;