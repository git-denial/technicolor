import React from 'react'
import CIcon from '@coreui/icons-react'
import {FaDollarSign, FaPuzzlePiece, FaStore ,FaRegPaperPlane} from "react-icons/fa";
import {MdStore} from "react-icons/md";
import {BsBag, BsChatSquareDots, BsPuzzle} from "react-icons/bs";
import {BiStore} from "react-icons/bi";
import {RiStore2Line} from "react-icons/ri";
import {AiOutlineUser} from "react-icons/all";
import {HiOutlinePuzzle} from "react-icons/hi";

const loginAs = sessionStorage.getItem('loginAs');
const vendorId = sessionStorage.getItem('vendorId');
console.log(vendorId)


const _nav_admin = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: <AiOutlineUser size={16} style={{marginLeft: 5, marginRight: 20}}/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Vendors',
    to: '/vendors',
    icon: <RiStore2Line size={16} style={{marginLeft: 5, marginRight: 20}}/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Transactions',
    to: '/transactions',
    icon: <FaDollarSign style={{marginLeft: 5, marginRight: 21}}/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Contacts',
    to: '/contacts',
    icon: <FaRegPaperPlane style={{marginLeft: 5, marginRight: 21}}/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Logout',
    to: '/logout',
    icon: 'cil-account-logout',
  },


]

export default _nav_admin
