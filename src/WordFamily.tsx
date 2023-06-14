import { useState } from "react";

const WordFamily = (p: {
  word: string;
  subwords: string[];
  onSelect: (word: string) => void;
}) => {
  const { word, subwords, onSelect } = p;
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <div
        className={`word bubble ${collapsed ? "collapsed" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setCollapsed(!collapsed);
        }}
      >
        {word}
      </div>
      {subwords.map((subword) => (
        <div
          key={subword}
          className={`subword bubble ${collapsed ? "collapsed" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(subword);
          }}
        >
          {subword}
        </div>
      ))}
    </>
  );
};

export default WordFamily;
