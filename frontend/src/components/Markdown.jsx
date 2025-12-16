import ReactMarkdown from 'react-markdown';

export default function Markdown({
    children,
    classNameUl = 'list-disc list-outside ml-6 mb-4 space-y-2',
    classNameOl = 'list-decimal list-outside ml-6 mb-4 space-y-2',
    classNameLi = 'pl-1',
    classNameP = 'mb-4',
}) {
    return (
        <ReactMarkdown
            components={{
                ul: ({ node, ...props }) => (
                    <ul className={classNameUl} {...props} />
                ),
                ol: ({ node, ...props }) => (
                    <ol className={classNameOl} {...props} />
                ),
                li: ({ node, ...props }) => (
                    <li className={classNameLi} {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className={classNameP} {...props} />
                ),
            }}
        >
            {children}
        </ReactMarkdown>
    )
}