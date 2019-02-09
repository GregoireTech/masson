import React from 'react';
import './controls.css'



const controls = (props) => {

    let remoteBig = false;
    let localBig = false;
    let containerBig = false;
    let containerClasses = 'controlsContainer containerSmall';
    let remoteClasses, localClasses;
    
    const changeVideoSize = e => {
        console.log(e.target.id);
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
        containerBig? containerClasses = 'controlsContainer containerBig' : containerClasses = 'controlsContainer containerSmall'  
        remoteBig? remoteClasses = 'videoBig' : remoteClasses = 'videoSmall'  
        localBig? localClasses = 'videoBig' : localClasses = 'videoSmall'  
        console.log(containerBig, containerClasses);
    }

    const controlsList1 = [
        { 
            link : 'invite',
            name: 'Inviter',
            click: props.openModal
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
            name: 'Aide',
            click: props.toggleHelp
        }
    ];
    const controlsList2 = [
        // { 
        //     linkOn : 'micon',
        //     linkOff : 'micoff',
        //     name: 'Micro On',
        //     state: true,
        //     click: toggleItem
        // },
        // { 
        //     linkOn : 'camon',
        //     linkOff : 'camoff',
        //     name: 'Vidéo On',
        //     state: true,
        //     click: toggleItem
        // },
        { 
            link : 'microphone',
            name: 'Micro On'
        },
        { 
            link : 'camera',
            name: 'Vidéo On'
        }
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
    let controlItems1 = dispatchControls(controlsList1);
    let controlItems2 = dispatchControls(controlsList2);
    

    return(
        <div id="controlsContainer" className={containerClasses}>
            <ul className='controls'>
                {controlItems1}
            </ul>
            <div  id='videoContainer'  >
                <ul className='controls'>
                    {controlItems2}
                </ul>
                <video autoPlay id="remoteVideo" onClick={changeVideoSize} className={remoteClasses} ></video>
                <video autoPlay muted id="localVideo" onClick={changeVideoSize} className={localClasses} ></video>
            </div>
        </div>
    );
};

export default controls;