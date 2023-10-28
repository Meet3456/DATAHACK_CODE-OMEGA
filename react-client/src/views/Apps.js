import React from 'react'
import logo from '../assets/court.png'
import Card from '../Components/Card'
import { Link } from 'react-router-dom';

const Apps = () => {
    return (
        <div>
            <div className='ml-[45%] flex items-center mt-32 space-x-5 font-bold'>
                <img src={logo} alt='logo' className='w-12 h-12'/>
                <p className='text-2xl'>NyayMitra</p>
            </div>
            <div className='ml-12 flex space-x-5 p-16 place-content-center'>
                <Link to="/chat" className='p-0 m-0'><Card head="Lawbot" to="/legal-info" info="Provides you with clear and concise explanations about legal terms."/></Link>
                <Card head="Document Summarization" info="Provides you with clear and concise explanations about legal terms."/>
                <Card head="Document Generation" info="Provides you with clear and concise explanations about legal terms."/>
                <Card head="Story Telling" info="Provides you with clear and concise explanations about legal terms."/>
            </div>
        </div>
    )
}

export default Apps