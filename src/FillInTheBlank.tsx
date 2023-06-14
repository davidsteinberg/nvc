import "./FillInTheBlank.css";
import { useRef } from "react";

const FillInTheBlank = (p: {
  prompt: string;
  punctuation: string;
  onChange: (text: string) => void;
}) => {
  const { prompt, punctuation, onChange } = p;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="FillInTheBlank">
      <div>
        {prompt.split(" ").map((word) => (
          <span key={word}>{word}&nbsp;</span>
        ))}
      </div>
      <div
        className="content"
        ref={ref}
        contentEditable={true}
        onInput={(e) =>
          onChange((e.target as HTMLDivElement).textContent ?? "")
        }
      ></div>
      <div>{punctuation}</div>
    </div>
  );
};

export default FillInTheBlank;
