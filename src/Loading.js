import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {
    return (
        <div className="progress">
            <CircularProgress size={80}/>
        </div>
    );
}

export default Loading