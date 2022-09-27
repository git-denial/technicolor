import React from 'react'
import CIcon from '@coreui/icons-react'
import {FaDollarSign, FaPuzzlePiece, FaStore} from "react-icons/fa";
import {MdStore} from "react-icons/md";
import {BsBag, BsChatSquareDots, BsPuzzle} from "react-icons/bs";
import {BiStore} from "react-icons/bi";
import {RiStore2Line} from "react-icons/ri";
import {AiOutlineUser} from "react-icons/all";
import {HiOutlinePuzzle} from "react-icons/hi";

const vendorId = sessionStorage.getItem('vendorId') || localStorage.getItem('vendorId');

const _nav_admin =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'My Products',
    to: '/my-product/' + vendorId,
    icon: <BsBag style={{marginLeft: 5, marginRight: 20}}/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Chat',
    to: '/chats',
    icon: <BsChatSquareDots style={{marginLeft: 5, marginRight: 21}}/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Transactions',
    to: '/transactions/' + vendorId,
    icon: <FaDollarSign style={{marginLeft: 5, marginRight: 21}}/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Logout',
    to: '/logout',
    icon: 'cil-account-logout',
  },
]

export default _nav_admin
