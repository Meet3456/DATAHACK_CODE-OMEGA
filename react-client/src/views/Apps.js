import React from "react";
import logo from "../assets/court.png";
import Card from "../Components/Card";
import { Link } from "react-router-dom";
import bg from "../assets/card_back.jpg";
import Footer from "../Components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGavel,
  faFile,
  faFileInvoice,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
// Usage

const Apps = () => {
  const Lawbot = (url) => {
    window.open(url, "_blank");
    // Check if a new tab was successfully opened
  };

  const Qnabot = (url) => {
    window.open(url, "_blank");
    // Check if a new tab was successfully opened
  };
  const pageStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    height: "750px",
    margin: "0px",
    padding: "0px",
  };
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='page' style={pageStyle}>
        <div className='ml-[45%] flex items-center space-x-5 font-bold'>
          <img src={logo} alt='logo' className='w-12 h-12 mt-20 ' />
          <p className='text-2xl mt-20'>NyayMitra</p>
        </div>
        <div className='ml-12 flex space-x-5 p-16 place-content-center'>
          <button onClick={Lawbot("http://localhost:8000")} className='p-0 m-0'>
            <Card
              head='Lawbot'
              icon={faGavel}
              info='Provides you with clear and concise explanations about difficult legal terms/jargons and heps you understand your Rights in various domains'
            />
          </button>
          <button onClick={Qnabot("http://localhost:8080")} className='p-0 m-0'>
            <Card
              head='Document QNA'
              icon={faFile}
              info='Upload any pdf in English Language and ask any questions regarding the document. If you have a document but its not in English then use our Translation Model to download The English document in your device.'
            />
          </button>
          <button onClick={Qnabot("http://localhost:8080")} className='p-0 m-0'>
            <Card
              head='Document Drafting'
              icon={faFileInvoice}
              info='If you wanna draft a legal document according to your preference then use this model for your Document Generation!'
            />
          </button>
          <button onClick={Qnabot("http://localhost:8080")} className='p-0 m-0'>
            <Card
              head='Translation'
              icon={faLanguage}
              info='Pdf are translated from any Langauge to any Language and saved in your device in Pdf format.'
            />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Apps;
