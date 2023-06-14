import "./Communication.css";
import BlockHierarchy from "./BlockHierarchy";
import FillInTheBlank from "./FillInTheBlank";
import { feelings, needs } from "./data";
import { useState } from "react";

const prompts = {
  observation: "When I",
  feelings: "I feel",
  reason: "because I",
  needs: "What I need is",
  request: "Would you be willing to",
};

const combineWordsStrings = (p: { words: string[]; kind: string }) => {
  const { words, kind } = p;
  let wordsString = "";

  if (words.length === 0) {
    alert(`Make sure to add some ${kind}!`);
    return null;
  } else if (words.length === 1) {
    wordsString = words[0];
  } else if (words.length === 2) {
    wordsString = `${words[0]} and ${words[1]}`;
  } else {
    const commaSeparated = words.slice(0, -1);
    const final = words[words.length - 1];

    wordsString = `${commaSeparated.join(", ")}, and ${final}`;
  }

  return wordsString;
};

const share = async (text: string) => {
  const data = { text };
  let shared = false;
  if (navigator.canShare(data)) {
    try {
      await navigator.share(data);
      shared = true;
    } catch (error) {
      console.error(error);
      shared = true;
    }
  }
  if (!shared) {
    try {
      await navigator.clipboard.writeText(text);
      shared = true;
      alert("Copied to clipboard!");
    } catch (error) {
      console.error(error);
    }
  }

  if (!shared) {
    alert(text);
  }
};

const Communication = () => {
  const [observation, setObservation] = useState("");
  const [feelingWords, setFeelingWords] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [needWords, setNeedWords] = useState<string[]>([]);
  const [request, setRequest] = useState("");

  return (
    <div className="Communication">
      <FillInTheBlank
        prompt={prompts.observation}
        punctuation=","
        onChange={(newObservation) => setObservation(newObservation)}
      />
      <BlockHierarchy
        prompt={prompts.feelings}
        hierarchy={feelings}
        onChange={(newFeelingWords) => setFeelingWords(newFeelingWords)}
      />
      <FillInTheBlank
        prompt={prompts.reason}
        punctuation="."
        onChange={(newReason) => setReason(newReason)}
      />
      <BlockHierarchy
        prompt={prompts.needs}
        hierarchy={needs}
        onChange={(newNeedWords) => setNeedWords(newNeedWords)}
      />
      <FillInTheBlank
        prompt={prompts.request}
        punctuation="?"
        onChange={(newRequest) => setRequest(newRequest)}
      />
      <button
        // disabled={true}
        onClick={() => {
          const feelingWordsString = combineWordsStrings({
            words: feelingWords,
            kind: "feelings",
          });
          if (feelingWordsString === null) {
            return;
          }

          const needWordsString = combineWordsStrings({
            words: needWords,
            kind: "needs",
          });
          if (needWordsString === null) {
            return;
          }

          const text = `${prompts.observation} ${observation},
${prompts.feelings} ${feelingWordsString},
${prompts.reason} ${reason}.
${prompts.needs} ${needWordsString}.
${prompts.request} ${request}?`;

          share(text);
        }}
      >
        Share
      </button>
    </div>
  );
};

export default Communication;
