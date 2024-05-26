import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
function Header({ uid }) {
  return (
    <div>
      <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            Crowdly
          </a>
          <form class="d-flex" role="search">
            <div>
              <NotificationsIcon />
            </div>

            <div>
              <MarkChatUnreadIcon />
            </div>
            <div>
              <a href={`/my-profile/${uid}`}>
                <AccountCircleIcon />
              </a>
            </div>
          </form>
        </div>
      </nav>
    </div>
  );
}

export default Header;
