import React from 'react';
import { useSelector } from 'react-redux';

function LoginProfile() {
  // Access the user's name from the Redux store
  const userName = useSelector(state => state.auth.user);

  return (
    <div className="UserLogin">
      <h5 className='text-lg'>Welcome, {userName.name}</h5>
      {/* Other UserLogin content */}
    </div>
  );
}

export default LoginProfile;
