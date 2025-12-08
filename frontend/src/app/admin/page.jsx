"use client";

import { useState, useRef } from "react";


export function TextAreaForm() {
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value, name : name }),
      });
      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setValue('');
      setName('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <label className="block text-sm font-medium text-gray-800">
        Information Name
        <input
          className="
            mt-2 block
            rounded-md border border-gray-300 p-3 text-base        
            resize-none      
            outline-none focus:ring-2 focus:ring-blue-500
          "
          rows={4}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type something..."
          required
        />
      </label>
      <label className="block text-sm font-medium text-gray-800">
        Your Information Text
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
  const [name, setName] = useState('');
  const [status, setStatus] = useState("idle");

  const fileInputRef = useRef(null);

  async function handleSubmit(e) {
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
    formData.append("name", name);

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

      setValue('');
      setName(''); 
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <label className="block text-sm font-medium text-gray-800">
        Information Name
        <input
          className="
            mt-2 block
            rounded-md border border-gray-300 p-3 text-base        
            resize-none      
            outline-none focus:ring-2 focus:ring-blue-500
          "
          rows={4}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type something..."
          required
        />
      </label>
      Your Information File
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
      {/* {value && (
        <pre className="mt-2 text-xs whitespace-pre-wrap border p-2 rounded">
          {value}
        </pre>
      )} */}
    </form>
  );
}

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsAuthed(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <form onSubmit={handleSubmit} className="border p-8 rounded-lg w-80">
          <h1 className="mb-4">Admin Login</h1>

          <input
            className="border w-full mb-3 p-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="border w-full mb-3 p-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <button type="submit" className="mt-2 border px-4 py-2">
            Login
          </button>
        </form>
      </div>
    );
  }

  return <div className="font-work-sans p-8 space-y-8">
    <TextAreaForm />
    <br />
    <FileSubmissionForm />
  </div>;
}
    