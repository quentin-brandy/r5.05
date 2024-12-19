'use client'
import { ImportWorkWeekData } from '@/lib/data';
import React, { useState } from 'react';

export default function ImportWorkweek() {
    const [fileContent, setFileContent] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [isPreview, setIsPreview] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (content) {
                    setFileContent(JSON.parse(content as string));
                    setIsPreview(true);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleTextInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextInput(event.target.value);
    };

    const handlePreview = () => {
        try {
            const parsedContent = JSON.parse(textInput);
            setFileContent(parsedContent);
            setIsPreview(true);
        } catch (error) {
            console.error('Invalid JSON input', error);
        }
    };

    const handleSend = async () => {
        if (fileContent) {
            try {
                const response = await ImportWorkWeekData(fileContent);
                if (!response.ok) {
                    throw new Error('Failed to send content');
                }
                console.log('Content sent successfully');
                setFileContent(null);
                setTextInput('');
                setIsPreview(false);
            } catch (error) {
                console.error('Failed to send content', error);
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Importer Un Fichier pour WorkWeek</h1>
            <div className="mb-4">
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Ou collez le contenu JSON :</h2>
                <textarea
                    value={textInput}
                    onChange={handleTextInputChange}
                    rows={10}
                    cols={50}
                    className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                />
                <button
                    onClick={handlePreview}
                    className="mt-2 inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400"
                >
                    Visualiser le JSON
                </button>
            </div>
            {isPreview && fileContent && (
                <>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Contenu à importer :</h2>
                        <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(fileContent, null, 2)}</pre>
                    </div>
                    <button
                        onClick={handleSend}
                        className="inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-400"
                    >
                        Confirmer l'import
                    </button>
                </>
            )}
        </div>
    );
}