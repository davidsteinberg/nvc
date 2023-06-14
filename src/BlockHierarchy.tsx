import "./BlockHierarchy.css";
import WordFamily from "./WordFamily";
import { useEffect, useState } from "react";

const BlockHierarchy = (p: {
  prompt: string;
  hierarchy: Record<string, string[]>;
  onChange: (words: string[]) => void;
}) => {
  const { prompt, hierarchy, onChange } = p;
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [addingWord, setAddingWord] = useState(false);

  const updateWords = (words: string[]) => {
    setSelectedWords(words);
    onChange(words);
  };

  useEffect(() => {
    const handler = () => {
      setAddingWord(false);
    };

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div className="BlockHierarchy">
      <div className="prompt">{prompt}</div>
      {selectedWords.map((word) => (
        <div key={word} className="selectedWord bubble">
          {word}
          <div
            className="x"
            onClick={(e) => {
              e.stopPropagation();
              updateWords(
                selectedWords.filter((selectedWord) => selectedWord !== word)
              );
            }}
          >
            x
          </div>
        </div>
      ))}
      {addingWord ? (
        Object.entries(hierarchy).map(([word, subwords]) => (
          <WordFamily
            key={word}
            word={word}
            subwords={subwords}
            onSelect={(subword) => {
              updateWords([...selectedWords, subword]);
              setAddingWord(false);
            }}
          />
        ))
      ) : (
        <div
          className="plus bubble"
          onClick={(e) => {
            e.stopPropagation();
            setAddingWord(true);
          }}
        >
          +
        </div>
      )}
    </div>
  );
};

export default BlockHierarchy;
