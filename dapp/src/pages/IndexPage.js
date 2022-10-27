import React from 'react';

const IndexPage = (props) => {
    const {address, onLogin, onLogout} = props;

    return (
        <>
            <h1>Loyalty DApp {address}</h1>
            { address ?
                <button onClick={onLogin}>Login</button> :
                <button onClick={onLogin}>Log</button>
            }
        </>
    );
}

export default IndexPage;