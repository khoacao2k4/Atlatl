import ReactMarkdown from 'react-markdown';

export default function Markdown({ children }) {
    return (
        <ReactMarkdown
            components={{
                ul: ({ node, ...props }) => (
                    <ul className="list-disc list-outside ml-6 mb-4 space-y-2" {...props} />
                ),
                // Custom styling for Ordered Lists (if you ever use them)
                ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-outside ml-6 mb-4 space-y-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                    <li className="pl-1" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className="mb-4" {...props} />
                ),
            }}
        >
            {children}
        </ReactMarkdown>
    )
}