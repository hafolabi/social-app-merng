import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import logo from '../img/logo.png'

export default function Topbar() {
  const { user, logout } = useContext(AuthContext)
  return (
    <nav className="navbar bg-light mb-lg-10 p-2">
      <div className="container d-flex justify-content-between align-item-center">
        <Link to="/" className="navbar-brand link">
          <div className="d-flex">
            <img src={logo} alt="logo" className="mr-2" />
            <div>SocialApp</div>
          </div>
        </Link>

        {user ? (
          <div className="d-flex align-items-center">
          <Link className='link' to='/'>
            <span className='mx-4 borderbtn px-3 py-1 text-muted'>{user.username}</span>
          </Link>
          
            <span className='borderbtn px-3 py-1 text-muted' onClick={logout}>Logout</span>
        
        </div>
        ) : (
          <div className="d-flex">
          <Link className='link' to='/login'>
            <span className='mx-4 borderbtn px-3 py-1 text-muted'>Login</span>
          </Link>
          <Link className='link' to='/register'>
            <span className='borderbtn px-3 py-1 text-muted'>Register</span>
          </Link>
        </div>
        )}
        
      </div>
    </nav>
  )
}

