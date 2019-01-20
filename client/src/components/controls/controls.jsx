import React from 'react';
import './controls.css'



const controls = (props) => {
    const controlsList = [
        { 
            link : 'invite',
            name: 'Inviter'
        },
        { 
            link : 'download',
            name: 'Télécharger'
        },
        { 
            link : 'file',
            name: 'Fichier'
        },
        { 
            link : 'info',
            name: 'Aide'
        },
        { 
            link : 'microphone',
            name: 'Micro On'
        },
        { 
            link : 'camera',
            name: 'Vidéo On'
        },
    ];

    let controlItems = controlsList.map((control) => {
        let imgUrl=require(`../../assets/icons/${control.link}.svg`);
        return(
            <li class='control' id={control.link} >
                <img src={imgUrl} alt={control.link}/>
                <span class='toolText'>{control.name}</span>
            </li>
        )    
    });

    return(
        <div class="controlsContainer">
            <ul id='controls'>
                {controlItems}
            </ul>
            <video autoplay id="remoteVideo"></video>
            <video autoplay id="localVideo"></video>
        </div>
    );
};

export default controls;