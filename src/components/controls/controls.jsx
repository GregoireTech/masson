import React from 'react';

//import downloadBoard from '../../helpers/downloadAsPdf';
import './controls.css'



const controls = (props) => {

    let remoteBig = false;
    let localBig = false;
    let containerBig = false;
    let gridStart, remoteGridStart, localGridStart, controlsList1;
    const controlsContainer = document.getElementById('controlsContainer');
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const controls = document.getElementsByClassName('control');
    const changeVideoSize = e => {
        const id = e.target.id;
        if (id === 'localVideo'){
            localBig = !localBig;
        } else if (id === 'remoteVideo'){
            remoteBig = !remoteBig;
        }
        if (remoteBig || localBig){
            containerBig = true;
        } else {
            containerBig = false;
        }
        containerBig? gridStart = 3 : gridStart = 4;
        if(containerBig){
            for (let i = 0; i < controls.length; i++) {
                controls[i].style.display = 'inline-block'
            };
            remoteBig? remoteGridStart = 1 : remoteGridStart = 2; 
            localBig? localGridStart = 1 : localGridStart = 2;  
        } else {
            for (let i = 0; i < controls.length; i++) {
                controls[i].style.display = 'block'
            };
            remoteGridStart = 1;
            localGridStart = 1;
        }
        controlsContainer.style.gridColumnStart = gridStart;
        localVideo.style.gridColumnStart = localGridStart;
        remoteVideo.style.gridColumnStart = remoteGridStart;

    }

    const controlsListTeacher = [
        { 
            link : 'invite',
            name: 'Inviter',
            click: props.openModal
        },
        { 
            link : 'download',
            name: 'Télécharger'
            //, click: downloadBoard

        },
        { 
            link : 'file',
            name: 'Fichier'
        },
        { 
            link : 'info',
            name: 'Aide',
            click: props.toggleHelp
        }
    ];
    const controlsListStudent = [
        { 
            link : 'download',
            name: 'Télécharger'
            //, click: downloadBoard

        },
        { 
            link : 'file',
            name: 'Fichier'
        },
        { 
            link : 'info',
            name: 'Aide',
            click: props.toggleHelp
        }
    ];

    const controlsList2 = [
        { 
            link : 'mic',
            name: 'Micro',
            state: true,
            click: props.toggleAudio
        },
        { 
            link : 'cam',
            name: 'Vidéo',
            state: true,
            click: props.toggleVideo
        },
    ];


    const dispatchControls = (list) => {
        return list.map((control) => {
            let imgUrl=require(`../../assets/icons/controls/${control.link}.svg`);
            if (control.click) {
                return(
                    <li onClick={control.click} key={control.link} className='control' id={control.link} >
                        <img src={imgUrl} alt={control.link}/>
                        <span className='toolText'>{control.name}</span>
                    </li>
                );        
            } else if (control.link ==='file'){
                return(
                    <li key={control.link} className='control' id={control.link} >
                        <input type='file' id='fileInput' />
                        <label htmlFor='fileInput' className='fileLabel'>
                            <img src={imgUrl} alt={control.link}/>
                            <span className='toolText'>{control.name}</span>
                        </label>
                    </li>
                );  
            } else {
                return(
                    <li key={control.link} className='control' id={control.link} >
                        <img src={imgUrl} alt={control.link}/>
                        <span className='toolText'>{control.name}</span>
                    </li>
                );    
            }
        });
    }
    const dispatchVideoControls = (list) => {
        return list.map((control) => {
            let setting;
            if(control.link === 'cam'){ setting = props.video } 
            else { setting = props.audio}
            let state;
            setting? state = 'On' : state = 'Off'
            let imgUrl=require(`../../assets/icons/controls/${control.link}${state}.svg`);
            const string = `${control.name} ${state}`
                return(
                    <li onClick={control.click} key={control.link} className='control' id={control.link} >
                        <img src={imgUrl} alt={control.link}/>
                        <span className='toolText'>{string}</span>
                    </li>
                );        
        });
    }
    props.teacher? controlsList1 = controlsListTeacher : controlsList1 = controlsListStudent
    let controlItems1 = dispatchControls(controlsList1);
    let controlItems2 = dispatchVideoControls(controlsList2);
    

    return(
        <div id="controlsContainer">
            <ul className='controls'>
                {controlItems1}
            </ul>
            <div  id='videoContainer'  >
                <ul className='controls'>
                    {controlItems2}
                </ul>
                <video autoPlay id="remoteVideo" onClick={changeVideoSize} ></video>
                <video autoPlay muted id="localVideo" onClick={changeVideoSize} ></video>
            </div>
        </div>
    );
};

export default controls;