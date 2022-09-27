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
import Product from "../../models/Product";
import {AiOutlinePlus} from "react-icons/ai";
import productsData from "./ProductsData";
import Admin from "../../models/Admin";

const Products = ({match}) => {
  const history = useHistory()

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, [])

  const getProducts = async () => {

    let productModel = new Product();
    try {
      let result = await productModel.getByVendor({vendor_id: match.params.vendorId});
      console.log(result);
      setProducts(result)
    } catch (e) {
      console.log(e);

    }
  }

  const createUser = async () => {
    let model = new Admin();
    let result = await model.register({username: 'admin', password:'admin'})
    console.log(result)
  }

  function thousandSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const DataTable = (
    <CDataTable
      items={products}
      fields={[
        {key: 'id', label: 'Id'},
        {key: 'name', label: 'Name'},
        {key: 'price', label: 'Price'},
        {key: 'vendor_id', label: 'Vendor'},
        {key: 'category', label: 'Category'},
        {key: 'main_photo_url', label: 'Main Photo'},
        {key: 'available', label: 'Available'},
        {key: "Opsi", label: ""},
      ]}
      hover
      striped
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
        Opsi: (item) => (
          <td>
            <Link to={'/my-product/1/update'} style={{textDecorationLine: 'none'}}>
              <CButton
                style={{maxWidth: 60}}
                size="sm"
                block
                variant="outline"
                color="warning"
              >
                Edit
              </CButton>
            </Link>
            {/*</td>*/}
            {/*<td>*/}
            <CButton
              style={{marginTop: 8, maxWidth: 60}}
              onClick={(e) => {

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
          <CCardHeader style={{display: 'flex', alignItems: 'center'}}>
            <div style={{flex: 1}}>
              Products
            </div>

            <div style={{
              display: "flex", flexDirection: "row"
            }}>
              <Link to={'/my-product/create/' + match.params.vendorId} style={{textDecorationLine: 'none'}}>
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

export default Products
