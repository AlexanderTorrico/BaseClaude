import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import "./hero.css"

const Hero = () => {

    const { t } = useTranslation();
    const [userInput, setUserInput] = useState('');
    const [placeholder, setPlaceholder] = useState('');

    // Array de 5 imágenes abstractas grises de Pexels
    const backgroundImages = [
        'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/916446/pexels-photo-916446.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg?auto=compress&cs=tinysrgb&w=1920'
    ];

    const [backgroundImage, setBackgroundImage] = useState('');
    const fullPlaceholder = "Describe your business idea...";

    useEffect(() => {
        // Seleccionar una imagen aleatoria al cargar
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        setBackgroundImage(backgroundImages[randomIndex]);
    }, []);

    // Efecto de escritura para el placeholder
    useEffect(() => {
        let index = 0;
        setPlaceholder("");
        const typingInterval = setInterval(() => {
            if (index < fullPlaceholder.length) {
                const nextChar = fullPlaceholder[index];
                setPlaceholder((prev) => prev + nextChar);
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 80);

        return () => clearInterval(typingInterval);
    }, []);

    const createPage = (event) => {
        event.preventDefault();
        if (userInput.trim()) {
            console.log("Idea del usuario:", userInput);
            // Aquí se procesará la idea para generar la landing
        }
    }

    return (
        <div className="hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1>Create a <span>free website</span> and launch your business</h1>
            <form onSubmit={createPage}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button type="submit" disabled={!userInput.trim()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </form>
        </div>
    )
}

export default Hero