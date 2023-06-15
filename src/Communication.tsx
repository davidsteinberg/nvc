import "./Communication.css";
import BlockHierarchy from "./BlockHierarchy";
import FillInTheBlank from "./FillInTheBlank";
import { feelings, needs } from "./data";
import { useCallback, useEffect, useState } from "react";

const prompts = {
  observation: "When I",
  feelings: "I feel",
  reason: "because I",
  needs: "What I need is",
  request: "Would you be willing to",
};

const alertToAdd = (thing: string) => {
  alert(`Make sure to add ${thing}!`);
};

const combineWordsStrings = (words: string[]) => {
  let wordsString = "";

  if (words.length === 0) {
    throw Error("Cannot combine 0 words");
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

const copy = async (text: string) => {
  try {
    // Try with clipboard
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  } catch (error) {
    console.error(error);

    // Try with execCommand
    const textarea = document.createElement("textarea");
    textarea.value = text;

    Object.assign(textarea.style, {
      position: "fixed",
      top: 0,
      right: 0,
      width: "2rem",
      height: "2rem",
      padding: 0,
      border: "none",
      outline: "none",
      boxShadow: "none",
      background: "transparent",
    });

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch (error) {
      console.error(error);
    }

    document.body.removeChild(textarea);

    if (copied) {
      alert("Copied to clipboard!");
    } else {
      // Alert text as last resort
      alert(
        `Unfortunately copying isn't working right now! You can select and copy the text here:\n\n${text}`
      );
    }
  }
};

const share = async (text: string) => {
  const data = { text };
  if (navigator.canShare && navigator.canShare(data)) {
    try {
      await navigator.share(data);
    } catch (error) {
      console.error(error);
    }
  }
};

const Communication = () => {
  const [observation, setObservation] = useState("");
  const [feelingWords, setFeelingWords] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [needWords, setNeedWords] = useState<string[]>([]);
  const [request, setRequest] = useState("");

  const getText = useCallback(
    (handler: (text: string) => void) => {
      if (observation.length === 0) {
        alertToAdd("an observation");
        return;
      }

      if (feelingWords.length === 0) {
        alertToAdd("some feelings");
        return;
      }

      if (reason.length === 0) {
        alertToAdd("a reason");
        return;
      }

      if (needWords.length === 0) {
        alertToAdd("some needs");
        return;
      }

      const feelingWordsString = combineWordsStrings(feelingWords);
      const needWordsString = combineWordsStrings(needWords);

      const text = `${prompts.observation} ${observation},
${prompts.feelings} ${feelingWordsString},
${prompts.reason} ${reason}.
${prompts.needs} ${needWordsString}.${
        request.length === 0 ? "" : `\n${prompts.request} ${request}?`
      }`;

      handler(text);
    },
    [observation, feelingWords, reason, needWords, request]
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const { key, metaKey } = event;

      if (metaKey) {
        if (key === "c") {
          getText(copy);
          event.preventDefault();
        } else if (key === "s") {
          getText(share);
          event.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [getText]);

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
      <div className="buttons">
        <button onClick={() => getText(copy)}>Copy</button>
        {navigator.canShare && navigator.canShare({ text: "text" }) ? (
          <button onClick={() => getText(share)}>Share</button>
        ) : null}
      </div>
    </div>
  );
};

export default Communication;
