import React from 'react';
import './modal.css';




const modal = (props) => {


    const modalComponent = (
        <div className='modal'>
            <p>Saisissez l'adresse email de l'élève que vous souhaitez inviter</p>
            <p>
                <input type='text' onChange={props.inputChanged}  />
            </p>
            {props.valid? null : <p className='unvalidEmail'>L'adresse email n'est pas valide</p>}
            <p>
                <button className='btn confirm' onClick={props.sendInvite} >Inviter</button>
                <button className='btn cancel' onClick={props.closeModal} >Annuler</button>
            </p>
        </div>
    );
    return(
        props.show? modalComponent : null
    );
}

export default modal;