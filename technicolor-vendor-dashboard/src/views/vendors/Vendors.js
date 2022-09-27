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

import vendorsData from './VendorsData'
import Vendor from "../../models/Vendor";
import {AiOutlinePlus} from "react-icons/ai";
import moment from "moment";
import UserModel from "../../models/User";

const Vendors = () => {
  const history = useHistory();
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getVendors();
  }, [])

  const getVendors = async () => {
    let vendorModel = new Vendor();
    try{
      let result = await vendorModel.getAll();
      console.log(result);

      setVendors(result);
    }catch (e) {
      console.log(e)
    }
  }

  const DataTable = (
    <CDataTable
      items={vendors}
      fields={[
        {key: 'id', label: 'Id'},
        {key: 'name', label: 'Name'},
        {key: 'email', label: 'Email'},
        {key: 'phone_num', label: 'Phone Number'},
        {key: 'city_code', label: 'City Code'},
        {key: 'logo_url', label: 'Logo'},
        {key: 'created_at', label: 'Created At'},
        {key: "Opsi", label: ""},
      ]}
      hover
      pagination={{align: 'center'}}
      striped
      itemsPerPage={10}
      scopedSlots={{
        logo_url: (item) => (
          <td>
            <img src={item.logo_url} style={{
              width: 80,
              height: 80,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.125)',

            }}/>
          </td>
        ),
        Opsi: (item) => (
          <td>

              <CButton
                style={{maxWidth: 70}}
                size="sm"
                block
                variant="outline"
                color="warning"
                onClick={()=>{
                  history.push('/vendor/update/' +item.id)
                }}
              >
                Edit
              </CButton>
            {/*</td>*/}
            {/*<td>*/}
            <CButton
              style={{marginTop: 8, maxWidth: 60}}
              onClick={async () => {
                console.log(item.id);
                try {
                  let vendorModel = new Vendor();

                  let result = await vendorModel.delete(item.id);
                  console.log(result);

                  if(result.success){
                    alert('Vendor has been deleted!');
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
            <CButton
              style={{marginTop: 8, maxWidth: 70}}
              onClick={(e) => {
                console.log(item.id)
                history.push('/my-product/'+item.id);
              }}
              size="sm" block variant="outline" color="success">
              Products
            </CButton>
          </td>
        ),
        created_at: (item)=> (
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        )
      }}
    />
  )

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader style={{display: 'flex', alignItems: 'center'}}>
            <div style={{flex: 1}}>
              Vendors
            </div>

            <div style={{
              display: "flex", flexDirection: "row"
            }}>
              <Link to={'/vendor/create'} style={{textDecorationLine: 'none'}}>
                <CButton
                  size="sm"
                  block
                  color="primary"
                  style={{
                    width: 100,
                    marginTop: 8,
                    marginRight: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div style={{flex: 1}}>
                    Add New
                  </div>
                  <AiOutlinePlus/>
                </CButton>
              </Link>
            </div>
            {/*<small className="text-muted"> example</small>*/}
          </CCardHeader>
          <CCardBody>
            {DataTable}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Vendors
