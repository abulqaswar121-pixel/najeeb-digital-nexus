import React, { useEffect, useState } from "react";

interface Props {
  words: string[];
  className?: string;
}

/** Types a word, pauses, erases it, then types the next one — on a loop. */
export const TypingWords: React.FC<Props> = ({ words, className }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length < 2) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const word = words[index % words.length];
    let delay = deleting ? 45 : 85;
    if (!deleting && text === word) delay = reduce ? 2600 : 1800;
    const timer = window.setTimeout(() => {
      if (reduce) {
        const next = (index + 1) % words.length;
        setIndex(next);
        setText(words[next]);
        return;
      }
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [text, deleting, index, words]);

  return (
    <span className="whitespace-nowrap">
      <span className={className}>{text}</span>
      <span className="ml-0.5 inline-block w-[3px] animate-pulse bg-[var(--eco-cyan,currentColor)] align-middle" style={{ height: "0.9em" }} />
    </span>
  );
};
