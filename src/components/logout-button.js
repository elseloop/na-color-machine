import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@material-ui/core';

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <Button
            onClick={() => logout()}
            id="naColorLogoutButton"
            color="secondary"
            variant="outlined"
            size="large"
            className="btn--logout"
        >
            Log out
        </Button>
    );
};

export default LogoutButton;
