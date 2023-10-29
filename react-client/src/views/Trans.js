import React, { useState } from 'react';

const Trans = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedModel, setSelectedModel] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    const translatePdf = () => {
        if (selectedFile && selectedLanguage && selectedModel) {
            const formData = new FormData();
            formData.append('pdf_file', selectedFile);
            formData.append('selected_language', selectedLanguage);
            formData.append('selected_model', selectedModel);

            fetch('/translate', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // You can handle the response from Flask here
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            alert('Please select a file, language, and model for translation.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-4 bg-gray-800 text-white border rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-indigo-400 mb-4">PDF Translation</h1>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="large_size">Select a PDF file</label>
                <input
                    onChange={handleFileChange}
                    className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="large_size"
                    type="file"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a language</label>
                <select
                    id="countries"
                    onChange={handleLanguageChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="">Choose a Language</option>
                    <option value="eng_Latn">English</option>
                    <option value="spa_Latn">Spanish</option>
                    <option value="fra_Latn">French</option>
                    <option value="deu_Latn">German</option>
                    <option value="hin_Deva">Hindi</option>
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="models" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a model</label>
                <select
                    id="models"
                    onChange={handleModelChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="">Choose a Model</option>
                    <option value="model1">Model 1</option>
                    <option value="model2">Model 2</option>
                    <option value="model3">Model 3</option>
                    {/* Add more model options here */}
                </select>
            </div>

            <button
                onClick={translatePdf}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded transition duration-300 ease-in-out cursor-pointer"
            >
                Translate PDF
            </button>
        </div>
    );
};

export default Trans;
