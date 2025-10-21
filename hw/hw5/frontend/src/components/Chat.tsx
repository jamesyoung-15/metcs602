import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Message = {
  user: string;
  text: string;
  time: number;
};


/**
 * Chat component for displaying and sending messages.
 * @param {string | undefined} username - The username of the current user to display in chat.
 * @returns The Chat component using socketio
 */
export default function Chat( { username } : { username: string | undefined } ) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  // default to username from props, or guest
  const [name, setName] = useState<string>(() => {
    return username || "Guest";
  });
  const socketRef = useRef<Socket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [unread, setUnread] = useState(0);

  // setup socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:3049", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log('socket connected', socketRef.current?.id);
    });

    socketRef.current.on("chat message", (msg: Message) => {
      setMessages((prev) => {
        const next = [...prev, msg];
        return next;
      });
      if (!open) setUnread((u) => u + 1);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || !socketRef.current) return;
    const msg: Message = { user: name || "Guest", text, time: Date.now() };
    socketRef.current.emit("chat message", msg);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Chat panel */}
      <div
        className={`flex flex-col bg-white shadow-lg border rounded-lg transition-transform duration-200 ${
          open ? "w-60 md:w-80 max-h-[36rem]" : "w-12 h-12"
        } overflow-hidden`}
      >
        {open ? (
          <>
            <div className="flex items-center justify-between px-3 py-2 text-white">
              <div className="flex items-center gap-2">
                <img src="/chat-round.svg" alt="Chat Room" className="w-5 h-5" />
                <span className="font-medium">Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-sm rounded p-1 w-[120px] md:px-2 md:py-1 text-black"
                  placeholder="name"
                />
                <button
                  className="text-black opacity-90 hover:opacity-100"
                  onClick={() => {
                    setOpen(false);
                    setUnread(0);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 px-3 py-2 overflow-y-auto bg-gray-50 space-y-2">
              {messages.length === 0 && (
                <div className="text-center text-sm text-gray-400 mt-6">
                  No messages yet.
                </div>
              )}
              {messages.map((m, i) => {
                const mine = m.user === name;
                return (
                  <div
                    key={i}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        mine
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-800 border"
                      }`}
                    >
                      <div className="font-semibold text-xs opacity-90">
                        {m.user}
                      </div>
                      <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
                      <div className="text-[10px] mt-1 opacity-70 text-right">
                        {new Date(m.time).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <form onSubmit={send} className="px-3 py-2 border-t bg-white">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <input
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <button
            onClick={() => {
              setOpen(true);
              setUnread(0);
            }}
            className="w-full h-full flex items-center justify-center text-white rounded-full"
            aria-label="Open chat"
          >
            <div className="relative">
              <img src="/chat-round.svg" alt="Chat" className="w-6 h-6" />
              {unread > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {unread}
                </span>
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
