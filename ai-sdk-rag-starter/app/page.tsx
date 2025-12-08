'use client';

import { useChat } from '@ai-sdk/react';
import { useState, FormEvent, useRef } from 'react';

export function TextAreaForm() {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value }),
      });
      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setValue('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <label className="block text-sm font-medium text-gray-800">
        Your message
        <textarea
          className="
            mt-2 block w-full
            rounded-md border border-gray-300 p-3 text-base
            h-48           
            resize-none      
            outline-none focus:ring-2 focus:ring-blue-500
          "
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something..."
          required
        />
      </label>

      <button
        type="submit"
        disabled={status === 'submitting' || !value.trim()}
        className="rounded-md px-4 py-2 text-sm font-medium border border-gray-300 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit'}
      </button>

      {status === 'success' && (
        <p className="text-xs text-green-600">Submitted!</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-600">Something went wrong.</p>
      )}
    </form>
  );
}

export function FileSubmissionForm() {
  const [value, setValue] = useState("");
  const [status, setStatus] =
    useState<"idle" | "submitting" | "success" | "error">("idle");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("submit 111");

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("Please choose a .docx file first");
      return;
    }

    const formData = new FormData();
    // "file" must match what backend expects
    formData.append("file", file);

    try {
      setStatus("submitting");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json(); 
        console.log(data.error); 
        throw new Error("Request failed");
      }

      const data = await res.json();
      setValue(data.text || "");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <label className="block text-sm font-medium text-gray-800">
        <input
          ref={fileInputRef}
          type="file"
          id="docxInput"
          accept=".docx, .pdf"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md px-4 py-2 text-sm font-medium border border-gray-300 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit"}
      </button>

      {status === "success" && (
        <p className="text-xs text-green-600">Submitted & converted!</p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-600">Something went wrong.</p>
      )}

      {/* show extracted text */}
      {value && (
        <pre className="mt-2 text-xs whitespace-pre-wrap border p-2 rounded">
          {value}
        </pre>
      )}
    </form>
  );
}

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              <div>
                <div className="font-bold">{m.role}</div>
                {m.parts.map(part => {
                  switch (part.type) {
                    case 'text':
                      return <p>{part.text}</p>;
                    case 'tool-getInformation':
                      return (
                        <p>
                          call{part.state === 'output-available' ? 'ed' : 'ing'}{' '}
                          tool: {part.type}
                          <pre className="my-4 bg-zinc-100 p-2 rounded-sm">
                            {JSON.stringify(part.input, null, 2)}
                          </pre>
                        </p>
                      );
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage({ text: input });
            setInput('');
          }}
        >
          <input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={e => setInput(e.currentTarget.value)}
          />
        </form>
      </div>
      <div className="flex flex-col">
        <TextAreaForm />
        <FileSubmissionForm />
      </div>
    </div>
  );
}