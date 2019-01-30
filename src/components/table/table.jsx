import React from 'react';
import {Link} from 'react-router-dom';

import './table.css';

const table = (props) => {
    let tableItems;
        if (props.roomList !== [] && props.roomList.length >= 1){
            console.log(props.roomList);
            tableItems = props.roomList.map((room, index) => {
                const itemText = `Tableau blanc créé le ${room.name} à ${room.time}`;
                return (
                    <div className="tableItem" key={index} >
                        <p className='roomName'>{itemText}
                            <Link to={`/rooms/?${room.string}`} >
                                <span className='link joinLink'>Rejoindre</span>
                            </Link>
                        </p>
                    </div>
                );
            });
        } else {
            tableItems = (<div className="room">Il n'y a pas encore de rooms, cliquez sur le bouton ci-dessus pour en créer une.</div> );
        }
    return (
        <div className='table'>
            {tableItems}
        </div>
    );
}

export default table;