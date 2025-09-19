"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function DiscussionBoard() {
  const [posts, setPosts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const postsContainerRef = useRef(null);

  const API_URL = "http://localhost:8080/posts";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const addPost = async () => {
    if (!inputValue.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputValue }),
      });
      const newPost = await res.json();
      setPosts(prev => [...prev, newPost]);
      setInputValue("");

      if (postsContainerRef.current) {
        postsContainerRef.current.scrollTop = postsContainerRef.current.scrollHeight;
      }
    } catch (err) {
      console.error("Failed to add post:", err);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 10,
        overflow: "hidden",
      }}
    >
      <h1>What is the meaning of life?</h1>
      <div
        ref={postsContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          columnCount: 4, 
          columnGap: "10px",
        }}
      >
        {posts.map(post => (
          <div
            key={post.id}
            style={{
              breakInside: "avoid",
              background: "#f0f0f0",
              padding: 10,
              marginBottom: 10,
              border: "1px solid black",
              wordBreak: "break-word",
            }}
          >
            {post.text}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "white",
          paddingTop: 10,
        }}
      >
        <div style={{ display: "flex" }}>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addPost()}
            placeholder="Type something..."
            style={{ flex: 1, padding: 5 }}
          />
          <button onClick={addPost} style={{ marginLeft: 5, padding: "0 10px" }}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}