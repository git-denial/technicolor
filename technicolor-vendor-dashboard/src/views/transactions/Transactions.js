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
  CButton,
  CTabs, CNav, CNavItem, CNavLink, CTabContent, CTabPane,
  CModalHeader, CModal, CModalBody, CModalTitle, CModalFooter, CLabel, CInput, CFormGroup, CForm
} from '@coreui/react'
import {AiOutlinePlus} from "react-icons/ai";
import ReceiptIMG from '../../assets/Payment Receipt/Receipt2.jpg'
import * as PropTypes from "prop-types";
import Transaction from "../../models/Transaction";
import moment from "moment";
import Order from "../../models/Order";

const transactionsData = [
  {
    id: '1',
    address: 'Adress 1',
    total_price: '1000000',
    created_at: '1 Dec 2020',
    username: 'User 1',
    shipping_status: 'WAITING_CONFIRMATION',
    paid_at: ' 3 Dec 2020'
  },
  {
    id: '2',
    address: 'Adress 2',
    total_price: '2000000',
    created_at: '2 Dec 2020',
    username: 'User 2',
    shipping_status: 'WAITING_CONFIRMATION',
    paid_at: ' 3 Dec 2020'
  },
  {
    id: '3',
    address: 'Adress 3',
    total_price: '3000000',
    created_at: '3 Dec 2020',
    username: 'User 3',
    shipping_status: 'WAITING_CONFIRMATION',
    paid_at: ' 3 Dec 2020'
  },
  {
    id: '4',
    address: 'Adress 4',
    total_price: '1000000',
    created_at: '1 Dec 2020',
    username: 'User 4',
    shipping_status: 'WAITING_PAYMENT',
  },
  {
    id: '5',
    address: 'Adress 5',
    total_price: '2000000',
    created_at: '2 Dec 2020',
    username: 'User 5',
    shipping_status: 'WAITING_PAYMENT'
  },
  {
    id: '6',
    address: 'Adress 6',
    total_price: '3000000',
    created_at: '3 Dec 2020',
    username: 'User 6',
    shipping_status: 'WAITING_PAYMENT'
  },
  {
    id: '7',
    address: 'Adress 7',
    total_price: '1000000',
    created_at: '1 Dec 2020',
    confirmed_at: '4 Dec 2020',
    username: 'User 7',
    vendor: 'vendor 3',
    shipping_status: 'PROCESSING',
    paid_at: ' 3 Dec 2020'
  },
  {
    id: '8',
    address: 'Adress 8',
    total_price: '2000000',
    created_at: '2 Dec 2020',
    confirmed_at: '5 Dec 2020',
    username: 'User 8',
    vendor: 'vendor 5',
    shipping_status: 'PROCESSING',
    paid_at: ' 3 Dec 2020'

  },
  {
    id: '9',
    address: 'Adress 9',
    total_price: '3000000',
    created_at: '3 Dec 2020',
    confirmed_at: '5 Dec 2020',
    username: 'User 9',
    vendor: 'vendor 1',
    shipping_status: 'PROCESSING',
    paid_at: ' 3 Dec 2020'

  },
  {
    id: '10',
    address: 'Adress 10',
    total_price: '3000000',
    created_at: '3 Dec 2020',
    username: 'User 10',
    paid_at: ' 3 Dec 2020',
    confirmed_at: '5 Dec 2020',
    vendor: 'vendor 2',
    arrived_at: '20 Dec 2020',
    shipping_status: 'ARRIVED'
  },
  {
    id: '11',
    address: 'Adress 9',
    total_price: '3000000',
    created_at: '3 Dec 2020',
    username: 'User 9',
    paid_at: ' 3 Dec 2020',
    confirmed_at: '5 Dec 2020',
    vendor: 'vendor 4',
    arrived_at: '20 Dec 2020',
    shipping_status: 'ARRIVED'
  },
  {
    id: '12',
    address: 'Adress 9',
    total_price: '3000000',
    created_at: '3 Dec 2020',
    username: 'User 9',
    paid_at: ' 3 Dec 2020',
    confirmed_at: '5 Dec 2020',
    vendor: 'vendor 1',
    arrived_at: '20 Dec 2020',
    shipping_status: 'ARRIVED'
  },
  {
    id: '13',
    address: 'Adress 9',
    total_price: '30000000',
    created_at: '3 Dec 2020',
    username: 'User 9',
    shipping_status: 'REJECTED',
    rejected_at: '3 Dec 2020'
  },
  {
    id: '14',
    address: 'Adress 9',
    total_price: '3000000',
    created_at: '3 Dec 2020',
    username: 'User 9',
    shipping_status: 'REJECTED',
    rejected_at: '3 Dec 2020'
  }
]

CForm.propTypes = {children: PropTypes.node};
const Transactions = () => {
  const history = useHistory()

  useEffect(() => {
    getTransactions();
  }, [])

  function thousandSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const loginAs = sessionStorage.getItem('loginAs') || localStorage.getItem('loginAs');


  const [transactionsWC, setTransactionsWC] = useState([]);
  const [transactionsARR, setTransactionsARR] = useState([]);
  const [transactionsPRO, setTransactionsPRO] = useState([]);
  const [transactionsWP, setTransactionsWP] = useState([]);
  const [transactionsREJ, setTransactionsREJ] = useState([]);
  const [transactionsEXP, setTransactionsEXP] = useState([]);
  const [transactionsDEL, setTransactionsDEL] = useState([]);
  const [transactionsCON, setTransactionsCON] = useState([]);
  const [transactionsWCV, setTransactionsWCV] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationID, setConfirmationID] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderLinesModal, setShowOrderLinesModal] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [ordersByTransactionId, setOrdersByTransactionId] = useState([])
  const [orderLinesByTransactionId, setOrderLinesByTransactionId] = useState([]);
  const [orderLineSubtotal, setOrderLineSubtotal] = useState(0)
  const [orderLineSubtotalWeight, setOrderLineSubtotalWeight] = useState(0)
  const [paymentProofURL, setPaymentProofURL] = useState(null);
  const [receiptId, setReceiptId] = useState(0)

  const getOrderLineSubtotal = async (orderLine) => {
    let sum = 0;
    for (let i in orderLine) {
      console.log('asdf')
      sum += orderLine[i].quantity * orderLine[i].product.price;

    }
    setOrderLineSubtotal(sum);
    console.log('sum of order line', sum);
    try {

    } catch (e) {
      console.log(e)
    }
  }

  const getOrderLineSubtotalWeight = async (orderLine) => {
    let sum = 0;
    for (let i in orderLine) {
      console.log('asdf')
      sum += orderLine[i].quantity * orderLine[i].product.weight;

    }
    setOrderLineSubtotalWeight(sum);
    console.log('sum of order line', sum);
    try {

    } catch (e) {
      console.log(e)
    }
  }

  const confirmReceipt = async (receipt) => {
    try {
      let orderModel = new Order();
      console.log('Receipt', receipt);
      console.log('Editing order id', receiptId)

      let body = {
        delivery_receipt: receipt,
        shipment_status: 'DELIVERING'
      }
      let result = await orderModel.update(receiptId, body);
      console.log('Updated', result);
      getTransactions()
      setReceiptId(0);
      setPaymentProofURL(null);
      setReceiptModal(false)
    }catch (e) {
      console.log(e);
    }

  }

  const getTransactions = async () => {
    console.log(transactionsData);
    let WCArr = [];
    let ARRArr = [];
    let PROArr = [];
    let DELArr = [];
    let WPArr = [];
    let REJArr = [];
    let EXPArr = [];
    let CONArr = [];
    let WCVArr = [];

    try {
      let transactionModel = new Transaction();
      let orderModel = new Order();
      let orderResult, result;


      orderResult = await orderModel.getAll();
      console.log('Orders', orderResult)
      result = await transactionModel.getAll();
      console.log('Transactions', result);

      for (const i in result) {
        if (result[i].payment_status === 'PAID') {
          WCArr.push(result[i]);
        } else if (result[i].payment_status === 'WAITING') {
          WPArr.push(result[i]);
        } else if (result[i].payment_status === 'REJECTED') {
          REJArr.push(result[i]);
        } else if (result[i].payment_status === 'EXPIRED') {
          EXPArr.push(result[i]);
        } else if (result[i].payment_status === 'CONFIRMED') {
          CONArr.push(result[i]);
        }
      }

      for (const i in orderResult) {
        if (orderResult[i].shipment_status === 'PROCESSING') {
          PROArr.push(orderResult[i]);
        } else if (orderResult[i].shipment_status === 'ARRIVED') {
          ARRArr.push(orderResult[i]);
        } else if (orderResult[i].shipment_status === 'DELIVERING') {
          DELArr.push(orderResult[i]);
        }
      }

      for (const i in orderResult){
        for(const j in CONArr){
          if(CONArr[j].id === orderResult[i].transaction_id){
            WCVArr.push(orderResult[i]);
          }
        }
      }

      console.log('Waiting vendor confirmation', WCVArr)

      console.log('Confirmed Transactions:', CONArr);
      setTransactionsWC(WCArr);
      setTransactionsARR(ARRArr);
      setTransactionsWP(WPArr);
      setTransactionsPRO(PROArr);
      setTransactionsREJ(REJArr);
      setTransactionsEXP(EXPArr);
      setTransactionsDEL(DELArr);
      setTransactionsCON(CONArr)
      setTransactionsWCV(WCVArr)
    } catch (e) {
      console.log(e)
    }
  }

  const confirmOrder = async  (id) => {
    try {
      console.log('Order to confirm', id)
      let orderModel = new Order();

      let result = orderModel.confirmOrder(id);
      console.log(result);

      alert('Transaction has been confirmed!')
      getTransactions();
    }catch (e) {
      console.log(e);
    }
  }

  const getOrdersByTransactionId = async (id) => {
    try {
      const orderModel = new Order();
      let result = await orderModel.getByTransactionId(id);
      setOrdersByTransactionId(result);
      console.log(result);
    } catch (e) {
      console.log(e)
    }
  }

  const confirmPayment = async (id) => {
    try {
      const transactionModel = new Transaction();

      let transactionResult = await transactionModel.confirmPayment(id);
      console.log('Transaction update result',transactionResult)

      //let result = await transactionModel.edit(id, body);
      alert('Payment has been confirmed!')
      setConfirmationModal(false);
      setConfirmationID(0);
      getTransactions();
    } catch (e) {
      console.log(e);
    }
  }

  const rejectPayment = async (id) => {
    try {
      const transactionModel = new Transaction();
      let body = {
        payment_status: 'REJECTED'
      }

      let transactionResult = await transactionModel.edit(id, body);
      console.log('Transaction update result',transactionResult)

      //let result = await transactionModel.edit(id, body);
      alert('Payment has been rejected! ')
      setConfirmationModal(false);
      setConfirmationID(0);
      getTransactions();
    } catch (e) {
      console.log(e);
    }
  }

  const confirmPaymentModal = (
    <CModal
      show={confirmationModal}
      onClose={() => setConfirmationModal(false)}
    >
      <CModalHeader closeButton>View Proof</CModalHeader>
      <img
        style={{
          width: '100%',
          objectFit: 'contain'
        }}
        src={paymentProofURL}
      />
      <CModalBody>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="info"
          onClick={() => confirmPayment(confirmationID)}
        >Confirm
        </CButton>
        <CButton
          color="danger"
          onClick={() => rejectPayment(confirmationID)}
        >Reject
        </CButton>
        <CButton
          color="secondary"
          onClick={() => setConfirmationModal(false)}
        >Cancel</CButton>
      </CModalFooter>
    </CModal>
  )

  const uploadReceiptModal = (
    <CModal
      show={receiptModal}
      onClose={() => {
        setReceipt(null);
        setReceiptModal(false);
      }}
    >
      <CModalHeader closeButton>Input Shipping Number</CModalHeader>
      <CModalBody>
        <CFormGroup row>
          <CCol md="3">
            <CLabel>Shipping Number</CLabel>
          </CCol>
          <CCol xs="12" md="9">
            <CInput
              placeholder="Input shipping number..."
              value={receipt}
              onChange={(e) => {
                setReceipt(e.target.value)
              }}
            />
          </CCol>
        </CFormGroup>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="info"
          onClick={() => confirmReceipt(receipt)}
        >Confirm
        </CButton>
        <CButton
          color="secondary"
          onClick={() => {
            setReceipt(null);
            setReceiptModal(false);
          }}
        >Cancel</CButton>
      </CModalFooter>
    </CModal>
  )


  const Table_WAITING_PAYMENT = (
    <CDataTable
      items={transactionsWP}

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'username', label: 'Username'},
        {key: 'email', label: 'Email'},
        {key: 'user_id', label: 'User Id'},
        {key: 'amount', label: 'Amount'},
        {key: 'address', label: 'Address'},
        {key: 'zip_code', label: 'Zip Code'},
        {key: 'city', label: 'City'},
        {key: 'province', label: 'Province'},
        {key: 'created_at', label: 'Created at'},
        {key: "Option", label: ""},
      ]}
      hover
      striped
      itemsPerPage={10}
      sorter
      pagination={{align: 'center'}}
      scopedSlots={{
        zip_code: (item) => (<>
          <td>
            {item.user.zip_code}
          </td>
        </>),
        province: (item) => (<>
          <td>
            {item.user.province}
          </td>
        </>),
        city: (item) => (<>
          <td>
            {item.user.city}
          </td>
        </>),
        address: (item) => (<>
          <td>
            {item.user.address}
          </td>
        </>),
        email: (item) => (<>
          <td>
            {item.user.email}
          </td>
        </>),
        user_id: (item) => (<>
          <td>
            {item.user.id}
          </td>
        </>),
        username: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        amount: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.amount)}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        Option: (item) => (
          <CButton
            size="sm"
            block
            variant="outline"
            color="success"
            style={{
              maxWidth: '80%',
              marginTop: '8px'
            }}
            onClick={() => {
              console.log(item)
              getOrdersByTransactionId(item.id)
              setShowOrderModal(true);
            }}
          >
            Transaction Detail
          </CButton>
        ),
      }}
    />
  )

  const Table_CONFIRMED_TRANSACTIONS = (
    <CDataTable
      items={transactionsCON}
      sorter

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'username', label: 'Username'},
        {key: 'email', label: 'Email'},
        {key: 'user_id', label: 'User Id'},
        {key: 'amount', label: 'Amount'},
        {key: 'address', label: 'Address'},
        {key: 'zip_code', label: 'Zip Code'},
        {key: 'city', label: 'City'},
        {key: 'province', label: 'Province'},
        {key: 'created_at', label: 'Created at'},
        {key: "Option", label: ""},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        zip_code: (item) => (<>
          <td>
            {item.user.zip_code}
          </td>
        </>),
        province: (item) => (<>
          <td>
            {item.user.province}
          </td>
        </>),
        city: (item) => (<>
          <td>
            {item.user.city}
          </td>
        </>),
        address: (item) => (<>
          <td>
            {item.user.address}
          </td>
        </>),
        email: (item) => (<>
          <td>
            {item.user.email}
          </td>
        </>),
        user_id: (item) => (<>
          <td>
            {item.user.id}
          </td>
        </>),
        username: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        amount: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.amount)}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        Option: (item) => (
          <CButton
            size="sm"
            block
            variant="outline"
            color="success"
            style={{
              maxWidth: '80%',
              marginTop: '8px'
            }}
            onClick={() => {
              console.log(item)
              getOrdersByTransactionId(item.id)
              setShowOrderModal(true);
            }}
          >
            Transaction Detail
          </CButton>
        ),
      }}
    />
  )

  const Table_WAITING_CONFIRMATION = (
    <CDataTable
      items={transactionsWC}
      sorter

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'username', label: 'Username'},
        {key: 'email', label: 'Email'},
        {key: 'user_id', label: 'User Id'},
        {key: 'amount', label: 'Amount'},
        {key: 'address', label: 'Address'},
        {key: 'zip_code', label: 'Zip Code'},
        {key: 'city', label: 'City'},
        {key: 'province', label: 'Province'},
        {key: 'created_at', label: 'Created at'},
        {key: "Option", label: ""},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        zip_code: (item) => (<>
          <td>
            {item.user.zip_code}
          </td>
        </>),
        province: (item) => (<>
          <td>
            {item.user.province}
          </td>
        </>),
        city: (item) => (<>
          <td>
            {item.user.city}
          </td>
        </>),
        address: (item) => (<>
          <td>
            {item.user.address}
          </td>
        </>),
        email: (item) => (<>
          <td>
            {item.user.email}
          </td>
        </>),
        user_id: (item) => (<>
          <td>
            {item.user.id}
          </td>
        </>),
        username: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        amount: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.amount)}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        Option: (item) => (
          <div>
            <CButton
              size="sm"
              block
              variant="outline"
              color="success"
              style={{
                maxWidth: '80%',
                marginTop: '8px'
              }}
              onClick={() => {
                console.log(item)
                getOrdersByTransactionId(item.id)
                setShowOrderModal(true);
              }}
            >
              Transaction Detail
            </CButton>
            <CButton
              size="sm"
              block
              variant="outline"
              color="info"
              style={{
                maxWidth: '80%',
                marginTop: '8px'
              }}
              onClick={() => {
                setConfirmationModal(true)
                console.log(item)
                setPaymentProofURL(item.payment_proof_url)
                setConfirmationID(item.id);
              }}
            >
              View Proof
            </CButton>
          </div>
        ),
      }}
    />
  )

  const Table_PROCESSING = (
    <CDataTable
      items={transactionsPRO}
      sorter

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'user', label: 'User'},
        {key: 'vendor', label: 'Vendor'},
        {key: 'delivery_fee', label: 'Delivery fee'},
        {key: 'delivery_method', label: 'Delivery Method'},
        {key: 'address_info', label: 'Address Info'},
        {key: 'price_sum', label: 'Total Payment'},
        {key: 'city_code', label: 'City Code'},
        {key: 'created_at', label: 'Created at'},
        {key: 'transaction_id', label: 'Transaction ID'},
        {key: 'Option', label: ''},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        price_sum: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.price_sum)}
          </td>
        </>),
        delivery_fee: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.delivery_fee)}
          </td>
        </>),
        user: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        vendor: (item) => (<>
          <td>
            {item.vendor.name}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        Option: (item) => (
          <div>
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
                console.log('from order lines arr', item)

                let orderModel = new Order();
                let result = await orderModel.getOrderLineById(item.id);
                console.log(result);

                await getOrderLineSubtotal(result)
                await getOrderLineSubtotalWeight(result)
                setShowOrderModal(false)
                setOrderLinesByTransactionId(result)
                setShowOrderLinesModal(true)
              }}
            >
              Order Detail
            </CButton>
          </div>
        ),
      }}
    />
  )

  const Table_WAITING_CONFIRMATION_VENDOR = (
    <CDataTable
      items={transactionsWCV}
      sorter

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'user', label: 'User'},
        {key: 'vendor', label: 'Vendor'},
        {key: 'delivery_fee', label: 'Delivery fee'},
        {key: 'delivery_method', label: 'Delivery Method'},
        {key: 'address_info', label: 'Address Info'},
        {key: 'price_sum', label: 'Total Payment'},
        {key: 'city_code', label: 'City Code'},
        {key: 'created_at', label: 'Created at'},
        {key: 'transaction_id', label: 'Transaction ID'},
        {key: 'Option', label: ''},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        price_sum: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.price_sum)}
          </td>
        </>),
        delivery_fee: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.delivery_fee)}
          </td>
        </>),
        user: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        vendor: (item) => (<>
          <td>
            {item.vendor.name}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        Option: (item) => (
          <div>
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
                console.log('from order lines arr', item)

                let orderModel = new Order();
                let result = await orderModel.getOrderLineById(item.id);
                console.log(result);

                await getOrderLineSubtotal(result)
                await getOrderLineSubtotalWeight(result)
                setShowOrderModal(false)
                setOrderLinesByTransactionId(result)
                setShowOrderLinesModal(true)
              }}
            >
              Order Detail
            </CButton>
            {
              loginAs === 'vendor' ?
                <CButton
                  size="sm"
                  block
                  variant="outline"
                  color="info"
                  style={{
                    maxWidth: '80%',
                    marginTop: '8px'
                  }}
                  onClick={() => {
                    confirmOrder(item.id)
                  }}
                >
                  Confirm Order (Vendor only)
                </CButton>
                : null
            }

          </div>
        ),
      }}
    />
  )

  const Table_DELIVERING = (
    <CDataTable
      items={transactionsDEL}
      sorter

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'delivery_receipt', label: 'Shipping Number'},
        {key: 'user', label: 'User'},
        {key: 'vendor', label: 'Vendor'},
        {key: 'delivery_fee', label: 'Delivery fee'},
        {key: 'delivery_method', label: 'Delivery Method'},
        {key: 'address_info', label: 'Address Info'},
        {key: 'price_sum', label: 'Total Payment'},
        {key: 'city_code', label: 'City Code'},
        {key: 'created_at', label: 'Created at'},
        {key: 'transaction_id', label: 'Transaction ID'},
        {key: 'Option', label: ''},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        price_sum: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.price_sum)}
          </td>
        </>),
        delivery_fee: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.delivery_fee)}
          </td>
        </>),
        user: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        vendor: (item) => (<>
          <td>
            {item.vendor.name}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        Option: (item) => (
          <div>
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
                console.log('from order lines arr', item)

                let orderModel = new Order();
                let result = await orderModel.getOrderLineById(item.id);
                console.log(result);

                await getOrderLineSubtotal(result)
                await getOrderLineSubtotalWeight(result)
                setShowOrderModal(false)
                setOrderLinesByTransactionId(result)
                setShowOrderLinesModal(true)
              }}
            >
              Order Detail
            </CButton>
          </div>
        ),
      }}
    />
  )


  const Table_ARRIVED = (
    <CDataTable
      items={transactionsARR}
      sorter

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'user', label: 'User'},
        {key: 'vendor', label: 'Vendor'},
        {key: 'delivery_fee', label: 'Delivery fee'},
        {key: 'delivery_method', label: 'Delivery Method'},
        {key: 'address_info', label: 'Address Info'},
        {key: 'price_sum', label: 'Total Payment'},
        {key: 'city_code', label: 'City Code'},
        {key: 'created_at', label: 'Created at'},
        {key: 'transaction_id', label: 'Transaction ID'},
        {key: 'Option', label: ''},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        price_sum: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.price_sum)}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        delivery_fee: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.delivery_fee)}
          </td>
        </>),
        user: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        vendor: (item) => (<>
          <td>
            {item.vendor.name}
          </td>
        </>),
        Option: (item) => (
          <div>
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
                console.log('from order lines arr', item)

                let orderModel = new Order();
                let result = await orderModel.getOrderLineById(item.id);
                console.log(result);

                await getOrderLineSubtotal(result)
                await getOrderLineSubtotalWeight(result)
                setShowOrderModal(false)
                setOrderLinesByTransactionId(result)
                setShowOrderLinesModal(true)
              }}
            >
              Order Detail
            </CButton>
          </div>
        ),
      }}
    />
  )

  const Table_REJECTED = (
    <CDataTable
      items={transactionsREJ}
      sorter

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'username', label: 'Username'},
        {key: 'email', label: 'Email'},
        {key: 'user_id', label: 'User Id'},
        {key: 'amount', label: 'Amount'},
        {key: 'address', label: 'Address'},
        {key: 'zip_code', label: 'Zip Code'},
        {key: 'city', label: 'City'},
        {key: 'province', label: 'Province'},
        {key: 'created_at', label: 'Created at'},
        {key: "Option", label: ""},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        zip_code: (item) => (<>
          <td>
            {item.user.zip_code}
          </td>
        </>),
        province: (item) => (<>
          <td>
            {item.user.province}
          </td>
        </>),
        city: (item) => (<>
          <td>
            {item.user.city}
          </td>
        </>),
        address: (item) => (<>
          <td>
            {item.user.address}
          </td>
        </>),
        email: (item) => (<>
          <td>
            {item.user.email}
          </td>
        </>),
        user_id: (item) => (<>
          <td>
            {item.user.id}
          </td>
        </>),
        username: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        amount: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.amount)}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        Option: (item) => (
          <CButton
            size="sm"
            block
            variant="outline"
            color="success"
            style={{
              maxWidth: '80%',
              marginTop: '8px'
            }}
            onClick={() => {
              console.log(item)
              getOrdersByTransactionId(item.id)
              setShowOrderModal(true);

            }}
          >
            Transaction Detail
          </CButton>
        ),
      }}
    />
  )

  const Table_EXPIRED = (
    <CDataTable
      items={transactionsEXP}
      sorter

      fields={[
        {key: 'id', label: 'Id'},
        {key: 'username', label: 'Username'},
        {key: 'email', label: 'Email'},
        {key: 'user_id', label: 'User Id'},
        {key: 'amount', label: 'Amount'},
        {key: 'address', label: 'Address'},
        {key: 'zip_code', label: 'Zip Code'},
        {key: 'city', label: 'City'},
        {key: 'province', label: 'Province'},
        {key: 'created_at', label: 'Created at'},
        {key: "Option", label: ""},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        zip_code: (item) => (<>
          <td>
            {item.user.zip_code}
          </td>
        </>),
        province: (item) => (<>
          <td>
            {item.user.province}
          </td>
        </>),
        city: (item) => (<>
          <td>
            {item.user.city}
          </td>
        </>),
        address: (item) => (<>
          <td>
            {item.user.address}
          </td>
        </>),
        email: (item) => (<>
          <td>
            {item.user.email}
          </td>
        </>),
        user_id: (item) => (<>
          <td>
            {item.user.id}
          </td>
        </>),
        username: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        amount: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.amount)}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        Option: (item) => (
          <CButton
            size="sm"
            block
            variant="outline"
            color="success"
            style={{
              maxWidth: '80%',
              marginTop: '8px'
            }}
            onClick={() => {
              console.log(item)
              getOrdersByTransactionId(item.id)
              setShowOrderModal(true);
            }}
          >
            Transaction Detail
          </CButton>
        ),
      }}
    />
  )


  const OrdersTable = (
    <CDataTable
      items={ordersByTransactionId}
      sorter
      fields={[
        {key: 'id', label: 'Id'},
        {key: 'user', label: 'User'},
        {key: 'vendor', label: 'Vendor'},
        {key: 'delivery_fee', label: 'Delivery fee'},
        {key: 'delivery_method', label: 'Delivery Method'},
        {key: 'address_info', label: 'Address Info'},
        {key: 'price_sum', label: 'Total Payment'},
        {key: 'city_code', label: 'City Code'},
        {key: 'created_at', label: 'Created at'},
        {key: 'transaction_id', label: 'Transaction ID'},
        {key: 'Option', label: ''},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        price_sum: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.price_sum)}
          </td>
        </>),
        user: (item) => (<>
          <td>
            {item.user.full_name}
          </td>
        </>),
        vendor: (item) => (<>
          <td>
            {item.vendor.name}
          </td>
        </>),
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        delivery_fee: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.delivery_fee)}
          </td>
        </>),
        Option: (item) => (
          <td>
            <CButton
              color={'primary'}
              onClick={async () => {
                console.log('from order lines arr', item.order_lines)
                await getOrderLineSubtotal(item.order_lines)
                await getOrderLineSubtotalWeight(item.order_lines)
                setShowOrderModal(false)
                setOrderLinesByTransactionId(item.order_lines)
                setShowOrderLinesModal(true)
              }}
            >
              Details
            </CButton>
          </td>
        ),
      }}
    />
  )

  const OrderLineTable = (
    <CDataTable
      items={orderLinesByTransactionId}
      sorter
      fields={[
        {key: 'id', label: 'Id'},
        {key: 'product_id', label: 'Product Id'},
        {key: 'product_name', label: 'Product Name'},
        {key: 'product_quantity', label: 'Product Quantity'},
        {key: 'product_weight', label: 'Product Weight (Per item)'},
        {key: 'product_price', label: 'Product Price (Per item)'},
        {key: 'product_total_weight', label: 'Total Weight'},
        {key: 'product_total_price', label: 'Total Price'},
      ]}
      hover
      striped
      itemsPerPage={10}
      pagination={{align: 'center'}}
      scopedSlots={{
        created_at: (item) => (<>
          <td>
            {new moment(item.created_at).format('DD MMM YYYY, hh:mm')}
          </td>
        </>),
        product_name: (item) => (<>
          <td>
            {item.product.name}
          </td>
        </>),
        product_quantity: (item) => (<>
          <td>
            {item.quantity}
          </td>
        </>),
        product_weight: (item) => (<>
          <td>
            {thousandSeparator(item.product.weight) + ' grams'}
          </td>
        </>),
        product_price: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.product.price)}
          </td>
        </>),
        product_total_weight: (item) => (<>
          <td>
            {thousandSeparator(item.product.weight * item.quantity) + ' grams'}
          </td>
        </>),
        product_total_price: (item) => (<>
          <td>
            {'Rp' + thousandSeparator(item.product.price * item.quantity)}
          </td>
        </>),
      }}
    />
  )

  const OrdersModal = (
    <CModal
      show={showOrderModal}
      size={'xl'}
      onClose={() => setShowOrderModal(false)}
    >
      <CModalHeader closeButton>
        <CModalTitle>Orders</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {OrdersTable}
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          onClick={() => setShowOrderModal(false)}
        >Close</CButton>
      </CModalFooter>
    </CModal>
  )

  const OrderLinesModal = (
    <CModal
      show={showOrderLinesModal}
      size={'xl'}
      onClose={() => setShowOrderLinesModal(false)}
    >
      <CModalHeader closeButton>
        <CModalTitle>Order Line</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {OrderLineTable}
      </CModalBody>
      <CModalFooter>
        <CRow><b>Subtotal Price: {'Rp' + thousandSeparator(orderLineSubtotal)}</b></CRow>
        <CRow><b style={{marginLeft: 5}}>Subtotal
          Weight: {thousandSeparator(orderLineSubtotalWeight) + ' grams'}</b></CRow>
        <CButton
          color="secondary"
          onClick={() => setShowOrderLinesModal(false)}
        >Close</CButton>
      </CModalFooter>
    </CModal>
  )


  const Data = (
    <CTabs activeTab="waiting_payment">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink data-tab="waiting_payment">
            Waiting for Payment (Transaction)
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink data-tab="waiting_confirmation_admin">
            Waiting Confirmation by Admin (Transaction)
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink data-tab="confirmed_by_admin">
            Confirmed by Admin (Transaction)
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink data-tab="confirmed_by_vendor">
            Waiting Confirmation by Vendor (Order)
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink data-tab="processing">
            Processing (Order)
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink data-tab="delivering">
            Delivering (Order)
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink data-tab="arrived">
            Arrived (Order)
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink data-tab="expired">
            Expired (Transaction)
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink data-tab="rejected">
            Rejected (Transaction)
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <CTabPane data-tab="waiting_payment">
          {Table_WAITING_PAYMENT}
        </CTabPane>
        <CTabPane data-tab="waiting_confirmation_admin">
          {Table_WAITING_CONFIRMATION}
        </CTabPane>
        <CTabPane data-tab="confirmed_by_admin">
          {Table_CONFIRMED_TRANSACTIONS}
        </CTabPane>
        <CTabPane data-tab="confirmed_by_vendor">
          {Table_WAITING_CONFIRMATION_VENDOR}
        </CTabPane>
        <CTabPane data-tab="processing">
          {Table_PROCESSING}
        </CTabPane>
        <CTabPane data-tab="delivering">
          {Table_DELIVERING}
        </CTabPane>
        <CTabPane data-tab="arrived">
          {Table_ARRIVED}
        </CTabPane>
        <CTabPane data-tab="expired">
          {Table_EXPIRED}
        </CTabPane>
        <CTabPane data-tab="rejected">
          {Table_REJECTED}
        </CTabPane>
      </CTabContent>
    </CTabs>
  )

  return (<>
      {OrdersModal}
      {OrderLinesModal}
      {uploadReceiptModal}
      {confirmPaymentModal}
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardHeader style={{display: 'flex', alignItems: 'center'}}>
              <div style={{flex: 1}}>
                Transactions
              </div>

              <div style={{
                display: "flex", flexDirection: "row"
              }}>
              </div>
            </CCardHeader>
            <CCardBody>
              {Data}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Transactions
