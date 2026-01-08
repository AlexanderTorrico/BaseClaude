import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { get, map } from "lodash";
import { withTranslation } from "react-i18next";

//i18n
import i18n from "../../../i18n";
import languages from "../../../common/languages";
import { httpRequestWithAuth } from "../../../services/httpService";

const LanguageDropdown = () => {
  // Declare a new state variable, which we'll call "menu"
  const [selectedLang, setSelectedLang] = useState("");
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE");
    setSelectedLang(currentLanguage || "en");
  }, [])

  const changeLanguageAction = async (lang: string) => {
    // Cambiar idioma en i18n
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);

    // Actualizar idioma en el perfil del usuario (localStorage)
    const dataProfile = localStorage.getItem("dataProfile");
    if (dataProfile) {
      try {
        const profile = JSON.parse(dataProfile);
        profile.language = lang;
        localStorage.setItem("dataProfile", JSON.stringify(profile));
      } catch (e) {
        console.error("Error updating dataProfile:", e);
      }
    }

    // Llamar a la API para persistir el cambio en el backend
    const token = localStorage.getItem("authToken");
    if (token) {
      await httpRequestWithAuth.put(
        "api/user/language",
        { language: lang },
        setLoading
      );
    }
  }

  const toggle = () => {
    setMenu(!menu);
  }
  
  return (
    <>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle className="btn header-item " tag="button">
          <img
            src={get(languages, `${selectedLang}.flag`)}
            alt="Skote"
            height="16"
            className="me-1"
          />
        </DropdownToggle>
        <DropdownMenu className="language-switch dropdown-menu-end">
          {map(Object.keys(languages), key => (
            <DropdownItem
              key={key}
              onClick={() => changeLanguageAction(key)}
              className={`notify-item ${selectedLang === key ? "active" : "none"
                }`}
            >
              <img
                src={get(languages, `${key}.flag`)}
                alt="Skote"
                className="me-1"
                height="12"
              />
              <span className="align-middle">
                {get(languages, `${key}.label`)}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default withTranslation()(LanguageDropdown)

