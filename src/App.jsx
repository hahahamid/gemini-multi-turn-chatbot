import { useState } from "react";
import "./App.css";

function App() {
  const [err, setErr] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const SurpriseOptions = [
    "Tell me a joke that always makes you laugh.",
    "What's something fascinating you learned recently?",
    "Share a piece of trivia that most people don't know.",
    "If you could have any superpower, what would it be and why?",
    "What's your favorite quote, and why does it resonate with you?",
    "Describe the most memorable dream you've ever had.",
    "If you could visit any place in the world, where would you go and what would you do there?",
    "What's a skill or hobby you've always wanted to learn?",
    "Share a fun fact about yourself that surprises people.",
    "If you could meet any historical figure, who would it be and what would you ask them?",
  ];

  const surprise = () => {
    const randomPrompt =
      SurpriseOptions[Math.floor(Math.random() * SurpriseOptions.length)];
    setValue(randomPrompt);
  };

  const getResponse = async () => {
    if (!value) {
      setErr("Error! Please ask a question first! ");
      return;
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:8080/gemini", options);
      const data = response.text();
      console.log(data);

      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: data,
        },
      ]);

      setValue("")

    } catch (error) {
      console.error(error);
      setErr("Something went wrong!");
    }
  };

  const clear = () => {
    setValue("") 
    setErr("") 
    setChatHistory([]) 
  }


  return (
    <>
      <div className="bg-neutral-800  h-screen text-white">
        <section className="px-10 py-10">
          <div className="flex justify-start items-center gap-x-3 p-4">
            <p className="text-xl font-sans">what do you want to know?</p>
            <button
              onClick={surprise}
              disabled={!chatHistory}
              className="bg-neutral-700 px-2.5 py-1.5 rounded-md text-center font-medium"
            >
              {" "}
              Surprise Me !{" "}
            </button>
          </div>

          <div className="flex justify-start items-center gap-x-3 p-4">
            <input
              className="rounded pr-4 ps-2 py-2 outline-none w-1/3 text-black bg-gray-500 placeholder-slate-200"
              type="text"
              value={value}
              placeholder="when is christmas?"
              onChange={(e) => setValue(e.target.value)}
            />
            {!err && (
              <button
                onClick={getResponse}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
                <span className="sr-only">Icon description</span>
              </button>
            )}
            {err && (
              <button onClick={clear} className="bg-black px-2 py-1 rounded-md text-center">
                Clear
              </button>
            )}
          </div>

          {err && <p>{err}</p>}

          <div className="search-result">
           {chatHistory  && chatHistory.map((chatItem, _index) => <div key={_index}>
              <p className="p-4">{chatItem.role} : {chatItem.parts}</p>
            </div>)}
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
