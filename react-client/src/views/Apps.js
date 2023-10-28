import React from 'react'
import logo from '../assets/court.png'
import Card from '../Components/Card'
import { Link } from 'react-router-dom';
import bg from '../assets/card_back.jpg'
const Apps = () => {
    const navigateWithHeaders = async () => {
        // Your custom headers
        const headers = {
            'test-header': 'test-value',
        };

        // The target URL
        const targetUrl = 'http://localhost:8000'; // Replace with the actual URL

        try {
            // Make a GET request with custom headers
            const response = await fetch(targetUrl, {
                method: 'GET',
                headers: headers,
            });

            // Check the response status
            if (response.ok) {
                // You can do something with the response here, e.g., parse JSON data
                const data = await response.json();
                console.log(data);
            } else {
                // Handle the error response
                console.error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('Request error:', error);
        }
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
                <img src={logo} alt='logo' className='w-12 h-12 mt-32 '/>
                <p className='text-2xl mt-32'>NyayMitra</p>
            </div>
            <div className='ml-12 flex space-x-5 p-16 place-content-center'>
                <button onClick={navigateWithHeaders} className='p-0 m-0'>
                <Card head="Lawbot" info="Provides you with clear and concise explanations about difficult legal terms/jargons."/>
                </button>
                <Card head="Document QNA" info="Provides you with clear and concise explanations about legal terms." />
                <Card head="Document Generation" info="Provides you with clear and concise explanations about legal terms." />
                <Card head="Translation" info="Provides you with clear and concise explanations about legal terms." />
            </div>
        </div>
    )
}

export default Apps