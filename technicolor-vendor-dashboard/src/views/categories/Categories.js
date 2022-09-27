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

import UserModel from '../../models/User';
import VendorCategory from '../../models/VendorCategory';

const Categories = () => {
  const history = useHistory()

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getUsers();

  }, [])

  const getUsers = async () => {
    let categoryModel = new VendorCategory();

    try{
      let result = await categoryModel.getAll();
      console.log(result);

      setCategories(result);
    }catch (e) {
      console.log(e);
    }
  }

  const DataTable = (
    <CDataTable
      items={categories}
      fields={[
        {key: 'id', label: 'Id'},
        {key: 'name', label: 'Name'},
        {key: 'Opsi', label: ''},
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
            Categories
          </CCardHeader>
          <CCardBody>
            {DataTable}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Categories
