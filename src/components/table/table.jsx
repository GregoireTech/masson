import React from 'react';
import {Link} from 'react-router-dom';

import './table.css';

const table = (props) => {
    let tableItems;
    console.log(props.boardList);
        if (props.boardList !== [] && props.boardList.length >= 1){
            
            tableItems = props.boardList.map((board, index) => {
                const itemText = `Tableau blanc créé le ${board.date} à ${board.time}`;
                return (
                    <div className="tableItem" key={index} >
                        <p className='roomName'>{itemText}
                            <Link to={`/boards/?${board.string}`} >
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