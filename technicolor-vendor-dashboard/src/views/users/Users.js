import React, {useState, useEffect} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination, CButton
} from '@coreui/react'

import usersData from './UsersData'
import UserModel from '../../models/User';

const Users = () => {
  const history = useHistory()

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();

  }, [])

  const getUsers = async () => {
    let userModel = new UserModel();

    try{
      let result = await userModel.getAll();
      console.log(result);

      setUsers(result);
    }catch (e) {
      console.log(e);
    }
  }

  const DataTable = (
    <CDataTable
      items={users}
      fields={[
        {key: 'id', label: 'Id'},
        {key: 'email', label: 'Email'},
        {key: 'full_name', label: 'Full Name'},
        {key: 'address', label: 'Address'},
        {key: 'province', label: 'Province'},
        {key: 'city', label: 'City'},
        {key: 'zip_code', label: 'Zip Code'},
        {key: "Opsi", label: ""},
      ]}
      hover
      striped
      pagination={{align: 'center'}}
      itemsPerPage={5}
      scopedSlots={{
        Opsi: (item) => (
          <td>
            <Link to={'/users/'+item.id+'/update'} style={{textDecorationLine: 'none'}}>
              <CButton
                size="sm"
                block
                variant="outline"
                color="warning"
                style={{maxWidth: 60}}
              >
                Edit
              </CButton>
            </Link>
            <CButton
              style={{marginTop: 8, maxWidth: 60}}
              onClick={async () => {
                console.log(item.id);
                try {
                  let userModel = new UserModel();

                  let result = await userModel.deleteById(item.id);
                  console.log(result);

                  if(result.success){
                    alert('User has been deleted!');
                    window.location.reload();
                  }

                } catch (e) {
                  console.log(e)
                  return alert('Deletion failed!');
                }

              }}
              size="sm" block variant="outline" color="danger">
              Delete
            </CButton>
          </td>
        ),
      }}
    />
  )

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
            {DataTable}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
