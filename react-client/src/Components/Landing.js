import React from "react";
import { NavLink } from "react-router-dom";
import bg from '../assets/bg.png'

const Landing = () => {
    return (
        <div className=''>
            <img src={bg} alt='bg' className='w-screen h-screen blur-sm absolute' />
            {/* <h1 className='absolute text-white text-[5rem] top-[70px] left-[10rem]'>Legal Answers, Anytime, ,<br />
            </h1> */}
            <div class="main">
                <h1>NyayMitra<div class="roller">
                    <span id="rolltext">
                        Legal Answers<br />
                    </span>
                </div>
                </h1>

            </div>
            <div className='ml-[75%] flex space-x-36'>
                <div className='absolute mt-7 text-white h-8 w-36 items-center flex flex-row absolute p-2 hover:underline'>
                    <button className='text-xl'>Login</button>
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="a-icon--arrow-north-east400 a-icon--text a-icon--no-align top-[0.05em] relative f-ui-1 ml-2 -mr-4" style={{ width: '1.5em', height: '1.5em' }} data-new="" aria-hidden="true" data-v-cbc994d7=""><polygon fill="currentColor" points="5 4.31 5 5.69 9.33 5.69 2.51 12.51 3.49 13.49 10.31 6.67 10.31 11 11.69 11 11.69 4.31 5 4.31" data-v-cbc994d7=""></polygon></svg>
                </div>
                <NavLink exact to="/apps">

                    <div className='absolute mt-7 text-white border border-white h-8 w-36 items-center flex flex-row absolute p-2 hover:bg-white hover:text-black'>
                        <button className='text-xl'>Get Started</button>
                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="a-icon--arrow-north-east400 a-icon--text a-icon--no-align top-[0.05em] relative f-ui-1 ml-2 -mr-4" style={{ width: '1.5em', height: '1.5em' }} data-new="" aria-hidden="true" data-v-cbc994d7=""><polygon fill="currentColor" points="5 4.31 5 5.69 9.33 5.69 2.51 12.51 3.49 13.49 10.31 6.67 10.31 11 11.69 11 11.69 4.31 5 4.31" data-v-cbc994d7=""></polygon></svg>
                    </div>
                </NavLink>
            </div>



        </div >
    )
}

export default Landing