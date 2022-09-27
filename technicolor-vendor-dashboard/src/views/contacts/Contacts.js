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
import moment from 'moment';
import Contact from "../../models/Contact";
import Order from "../../models/Order";

const Products = ({match}) => {
  const history = useHistory()

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, [])

  const getProducts = async () => {

    let contactModel = new Contact();
    try {
      let result = await contactModel.getAll();
      console.log(result);
      setProducts(result)
    } catch (e) {
      console.log(e);

    }
  }

  function thousandSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const DataTable = (
    <CDataTable
      items={products}
      fields={[
        {key: 'name', label: 'Name'},
        {key: 'email', label: 'Email'},
        {key: 'created_at', label: 'Created_at'},
        {key: 'Opsi', label: ''}
      ]}
      hover
      striped
      sorter
      itemsPerPage={5}
      pagination={{align: 'center'}}
      scopedSlots={{
        price: (item) => (
          <td>
            {'Rp' + thousandSeparator(item.price)}
          </td>
        ),

        main_photo_url: (item) => (
          <td>
            <img src={item.main_photo_url} style={{
              width: 300,
              height: 150,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.125)',
              objectFit: 'contain',
              backgroundColor: 'white'
            }}/>
          </td>
        ),
        available: (item) => (
          <td>
            {item.available ? 'Yes' : 'Sold Out'}
          </td>
        ),
        created_at: (item) => (
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        ),
        Opsi: (item) => (
          <td>
            <CButton
              size="sm"
              block
              variant="outline"
              color="success"
              style={{
                maxWidth: '80%',
                marginTop: '8px'
              }}
              onClick={async () => {
                history.push('/contact/' + item.id)
              }}
            >
              Detail
            </CButton>
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
              Contacts
            </div>

            <div style={{
              display: "flex", flexDirection: "row"
            }}>
              <Link to={'/my-product/create/' + match.params.vendorId} style={{textDecorationLine: 'none'}}>
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

export default Products
