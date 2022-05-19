import {Box} from '@material-ui/core';
import LogoutButton from './logout-button';
import React from "react";
import Typography from '@material-ui/core/Typography';

const AuthenticatedNav = ({logo, user}) => {

  return (
    <Box
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        margin: "2rem 0 5rem",
      }}
    >
      <Box
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row",
        }}
      >
        <img
          style={{ width: "125px", margin: "0 2ch 0 0" }}
          className="brand"
          src={logo}
          alt="Next Adventure logo"
        />
        <Typography
          variant="overline"
          component="h1"
          style={{ margin: "0", fontSize: "1.5rem" }}
        >
          Color code generator
        </Typography>
      </Box>

      <Box
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",
          flexDirection: "row",
        }}
      >
        <img className="user-avatar" src={user.picture} alt={user.name} />
        <LogoutButton />
      </Box>
    </Box>
  );
}

export default AuthenticatedNav;
