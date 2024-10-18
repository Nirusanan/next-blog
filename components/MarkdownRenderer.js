import React from 'react';
import ReactMarkdown from 'react-markdown';
import {BlockMath, InlineMath} from 'react-katex';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

const MarkdownRenderer = ({content}) => {
    // Pre-process content to handle LaTeX delimiters
    const processedContent = content
        .replace(/\\\(/g, '$')
        .replace(/\\\)/g, '$')
        .replace(/\\\[/g, '$$')
        .replace(/\\\]/g, '$$');

    return (
        <ReactMarkdown
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isLatex = className === 'language-latex';

                    if (isLatex) {
                        return inline ? (
                            <InlineMath math={String(children).replace(/\n/g, ' ')}/>
                        ) : (
                            <BlockMath math={String(children).replace(/\n/g, ' ')}/>
                        );
                    }

                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
                p: ({children}) => {
                    // Custom paragraph component to handle inline LaTeX
                    return (
                        <p className="mb-4">
                            {React.Children.map(children, (child) => {
                                if (typeof child === 'string') {
                                    const parts = child.split(/(\$[^\$]+\$)/g);
                                    return parts.map((part, index) => {
                                        if (part.startsWith('$') && part.endsWith('$')) {
                                            return <InlineMath key={index} math={part.slice(1, -1)}/>;
                                        }
                                        return part;
                                    });
                                }
                                return child;
                            })}
                        </p>
                    );
                },
                // Custom component to handle block LaTeX
                div: ({children}) => {
                    if (
                        children &&
                        children.length === 1 &&
                        typeof children[0] === 'string' &&
                        children[0].startsWith('$$') &&
                        children[0].endsWith('$$')
                    ) {
                        return <BlockMath math={children[0].slice(2, -2)}/>;
                    }
                    return <div>{children}</div>;
                },
                h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                ul: ({children}) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
                li: ({children}) => <li className="mb-2">{children}</li>,
            }}
            className="space-y-4"
        >
            {processedContent}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;