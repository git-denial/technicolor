import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import Logo from '../assets/Logo/logo.png';

// sidebar nav config
import navigation_admin from './_nav_admin'
import navigation_vendor from './_nav_vendor'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  const loginAs = sessionStorage.getItem('loginAs');

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <img
          className="c-sidebar-brand-full"
          height={150}
          style={{margin: 10}}
          src={Logo}/>

        <img
          className="c-sidebar-brand-minimized"
          style={{}}
          src={Logo}/>

      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={loginAs === 'admin' ? navigation_admin : navigation_vendor}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
