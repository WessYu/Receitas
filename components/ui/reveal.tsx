"use client";

import { CSSProperties, ReactNode, useEffect, useRef } from "react";

type RevealTag = "div" | "section" | "article";

type RevealProps = {
  as?: RevealTag;
  children: ReactNode;
  className?: string;
  delay?: number;
};

const observedNodes = new WeakSet<Element>();
let sharedObserver: IntersectionObserver | null = null;

function getRevealObserver() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          sharedObserver?.unobserve(entry.target);
          observedNodes.delete(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  return sharedObserver;
}

export function Reveal({ as: Tag = "div", children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = getRevealObserver();

    if (!observer) {
      node.setAttribute("data-visible", "true");
      return;
    }

    observedNodes.add(node);
    observer.observe(node);

    return () => {
      if (observedNodes.has(node)) {
        observer.unobserve(node);
        observedNodes.delete(node);
      }
    };
  }, []);

  return (
    <Tag
      ref={(node) => {
        ref.current = node;
      }}
      className={className}
      data-reveal
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
