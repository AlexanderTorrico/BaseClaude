import { useTranslation } from "react-i18next";
import Cookies from "./Cookies/Cookies"
import Hero from "./Hero/Hero"
import { useEffect } from "react";
import Header from "./Header/Header";

const Landing = () => {
    const { i18n } = useTranslation();
    useEffect(() => {
        const listLenguaje = ['en', 'it', 'es'];
        const languageBrowser = navigator.language.slice(0, 2); //'en-US' → 'en'
        const languageDetected = listLenguaje.includes(languageBrowser) ? languageBrowser : 'en';
        console.log("Idioma detectado:", languageDetected);
        console.log((languageDetected == "en" && "eng") || (languageDetected == "es" && "esp") || "it");

        i18n.changeLanguage((languageDetected == "en" && "eng") || (languageDetected == "es" && "sp") || "it");
        // i18n.changeLanguage("eng");
    }, [])

    return (
        <>
            <Header />
            <Hero />
            <Cookies />
        </>
    )
}

export default Landing