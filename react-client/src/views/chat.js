import React, { useState, useRef } from "react";
import "../index.css";
import { FaHome, FaComments } from 'react-icons/fa';
import { Sidebar } from "react-custom-sidebar";

const themeColors = {
  light: {
    bgColor: "#9C254D",
    textColor: "white",
    highlights: "#D23369",
  },
  dark: {
    bgColor: "#0f0f1f",
    textColor: "#ffffff",
    highlights: "#21213d",
  },
};


export function Chat() {
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // const examples = [
  //   "Who is the best Employee?",
  //   "How Many emplyee works under me?",
  //   "What is this months Sales?",
  //   "How to improve my Employees?",
  // ]

  const [isMenuOpen, setIsMenuOpened] = useState(false);
  const chatContainerRef = useRef(null);
  // menu list
  const menuItems = [
    {
      title: "Home",
      link: "/apps",
      icon: <FaHome />,
    },
    {
      title: "Chatbot",
      link: "/chat",
      icon: <FaComments />,
    },
  ];


  const sendQueryToAPI = async () => {
    try {
      // Add the user's query to chat history
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { userQuery, answer: "..." },
      ]);
      setUserQuery("");
      const response = await fetch("/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userQuery }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Update the chat history with the response
        setChatHistory((prevChatHistory) => {
          const updatedHistory = [...prevChatHistory];
          updatedHistory[prevChatHistory.length - 1].answer = data.answer;
          return updatedHistory;
        });
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        // Clear user input
      } else {
        console.error("Failed to fetch data from API");
      }
    } catch (error) {
      console.error("Error sending query to API:", error);
    }
  };
  
  


  return (
    <>
      <div className="h-screen w-screen flex bg-white">
        <div className="w-[15%]">
          <Sidebar
            menuItems={menuItems}
            theme="dark"
            themeColors={themeColors}
            isSidebarOpened={isMenuOpen}
            handleSidebarToggle={setIsMenuOpened}
            showToggleButton={true}
            logoUrl="add logo url here"
            logoSmallUrl="add small logo url here which will be visible in closed state"
            userDetails={{
              name: "Haadi ;)",
              description: "User",
              avatar: "add user avatart url here",
            }}
            closeOnLinkClick={false}
            closeOnOutsideClick={false}
          >
          </Sidebar>
        </div>
        <div className="w-[85%]">
          <div className="h-[80%] flex flex-col justify-center items-center text-white">
            <div className="text-4xl font-bold mb-8 mt-3 text-black">NyayMitra</div>
            <div className="h-[100%] w-[90%] overflow-y-auto">
              <div className="chat-container w-[100%]" ref={chatContainerRef}>
                {chatHistory.map((item, index) => (
                  <div key={index} className="mb-5">
                    <div className="w-[80%] ml-56">
                      <div className="bg-blue-500 text-white  ml-auto rounded-lg max-w-max p-3 mb-5">
                        {item.userQuery}
                      </div>
                    </div>
                    <div className="w-[80%]">
                      <div className="bg-gray-300 text-black rounded-lg p-3  max-w-max">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className='flex flex-wrap justify-around max-w-[900px] '>
              {
                examples.map((item, index) => (
                  <div className='text-lg font-light mt-4 p-4 border rounded cursor-pointer min-w-[400px] Ohover:bg-slate-800'>
                    {item}</div>))
              }
            </div> */}
          </div>
          <div className="h-[20%]">
            <div className="flex flex-col items-center justify-center w-full h-full text-white">
              <div className="w-[75%] flex justify-center relative">
                <input
                  type="text"
                  className=" w-full rounded-lg pr-14 pt-4 pl-4 pb-4 bg-slate-800 text-white"
                  value={userQuery}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendQueryToAPI();
                    }
                  }}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Type your message here..."
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer"
                  onClick={sendQueryToAPI}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-send"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 14l11 -11" />
                    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
