import React, { Component } from 'react';
import './Room.css';

import Tools from '../../components/tools/tools';
import Controls from '../../components/controls/controls';

class Room extends Component {
    render() {
        return (
            <div class='globalContainer'>
                <Tools />

                <div id="container">
                    <canvas id="imageView" width="800px" height="500px">
                        <p>Unfortunately, your browser is currently unsupported by our web
                            application. We are sorry for the inconvenience. Please use one of the
                            supported browsers listed below, or draw the image you want using an
                            offline tool.
                        </p>
                        <p>Supported browsers: 
                            <a href="http://www.opera.com">Opera</a>, 
                            <a href="http://www.mozilla.com">Firefox</a>,
                            <a href="http://www.apple.com/safari">Safari</a>, and 
                            <a href="http://www.konqueror.org">Konqueror</a>.
                        </p>
                    </canvas>
                </div>
                <Controls />
            </div>
        );
    };
};

export default Room;
