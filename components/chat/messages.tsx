'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              What's on your mind today?
            </h2>
            <p className="text-gray-600">
              Start a conversation and I'll help you out.
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props} />
                      ),
                      code: ({ node, inline, ...props }) => (
                        <code
                          className={
                            inline
                              ? 'bg-gray-200 text-red-600 px-1 rounded text-xs'
                              : 'block bg-gray-800 text-gray-100 p-3 rounded-md my-2 overflow-x-auto'
                          }
                          {...props}
                        />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-gray-800 text-gray-100 p-3 rounded-md my-2 overflow-x-auto" {...props} />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 className="text-lg font-bold mt-3 mb-2" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-base font-bold mt-2 mb-1" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-bold mt-2 mb-1" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside mb-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside mb-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-gray-400 pl-4 italic my-2"
                          {...props}
                        />
                      ),
                      table: ({ node, ...props }) => (
                        <table
                          className="border-collapse border border-gray-300 my-2 w-full"
                          {...props}
                        />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-gray-300 px-2 py-1 bg-gray-200" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-gray-300 px-2 py-1" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-600 underline" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
              <div
                className={`text-xs mt-2 ${
                  message.role === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))
      )}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
