import React from 'react';
import './Browser.css';

const browser = () => {
    const logoUrl = require('../../assets/icons/logo.svg');
    return(
        <div id="browser">
            <div className='headerContainer'>
                <img src={logoUrl} id='logo' alt='logo' />
                <h1 className='brand'>COURS MASSON</h1>
                <h2 className='title'>
                    Tableau blanc interactif pour cours particuliers
                </h2>
                <p className='browserContent'>
                    Votre navigateur n'est pas compatible avec cette application.
                    Merci d'utiliser 
                    <a className='link' href='https://www.google.com/chrome/'>Chrome</a>
                    ou
                    <a className='link' href='https://support.apple.com/downloads/safari'>Safari</a>.
                </p>
            </div>

        </div>
    );
}

export default browser;