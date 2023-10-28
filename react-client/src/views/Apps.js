import React from 'react'
import logo from '../assets/court.png'
import Card from '../Components/Card'
import { Link } from 'react-router-dom';
import bg from '../assets/card_back.jpg'

const openInNewTab = (url, customHeader) => {
    const newTab = window.open(url, '_blank');

    // Check if a new tab was successfully opened
    if (newTab) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        // Set the custom header
        xhr.setRequestHeader('test-header', customHeader);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // You can handle the response here if needed
            }
        };

        xhr.send();
    } else {
        // Handle cases where a new tab could not be opened
        console.error('Unable to open a new tab');
    }
};

// Usage



const Apps = () => {
    const handleOpenNewTab = () => {
        const url = 'http://localhost:8000';
        const customHeaderValue = 'test-value';

        openInNewTab(url, customHeaderValue);
    };


    const pageStyle = {
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        height: "900px",
        margin: "0px",
        padding: "0px",
    };
    return (
        <div className='page' style={pageStyle}>
            <div className='ml-[45%] flex items-center space-x-5 font-bold'>
                <img src={logo} alt='logo' className='w-12 h-12 mt-32 ' />
                <p className='text-2xl mt-32'>NyayMitra</p>
            </div>
            <div className='ml-12 flex space-x-5 p-16 place-content-center'>
                <button onClick={handleOpenNewTab} className='p-0 m-0'>
                    <Card head="Lawbot" info="Provides you with clear and concise explanations about difficult legal terms/jargons." />
                </button>
                <Card head="Document QNA" info="Provides you with clear and concise explanations about legal terms." />
                <Card head="Document Generation" info="Provides you with clear and concise explanations about legal terms." />
                <Card head="Translation" info="Provides you with clear and concise explanations about legal terms." />
            </div>
        </div>
    )
}

export default Apps