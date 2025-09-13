import React from "react";
import PropTypes from "prop-types";

const Avatar = ({ nameField, emailField, avatarField, size = "xs", bgColor = "primary" }) => {
  return ({ row }) => {
    const name = row.original[nameField] || "";
    const email = emailField ? row.original[emailField] : null;
    const avatar = avatarField ? row.original[avatarField] : null;

    return (
      <div className="d-flex align-items-center">
        <div className={`avatar-${size} rounded-circle bg-${bgColor} text-white d-flex align-items-center justify-content-center me-3`}>
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="rounded-circle"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h6 className="mb-0">{name}</h6>
          {email && <p className="text-muted mb-0 small">{email}</p>}
        </div>
      </div>
    );
  };
};

Avatar.propTypes = {
  nameField: PropTypes.string.isRequired,
  emailField: PropTypes.string,
  avatarField: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  bgColor: PropTypes.string
};

export default Avatar;