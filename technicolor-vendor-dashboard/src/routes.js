import React from 'react';

// const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
// const Tables = React.lazy(() => import('./views/base/tables/Tables'));
//
// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
// const Cards = React.lazy(() => import('./views/base/cards/Cards'));
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
// const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));
//
// const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
// const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
// const Navs = React.lazy(() => import('./views/base/navs/Navs'));
// const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
// const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
// const Switches = React.lazy(() => import('./views/base/switches/Switches'));
//
// const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
// const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
// const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
// const Charts = React.lazy(() => import('./views/charts/Charts'));
// const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
// const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const UserForm = React.lazy(() => import('./views/users/UserForm'));
const Vendors = React.lazy(() => import('./views/vendors/Vendors'));
const VendorUpdate = React.lazy(() => import('./views/vendors/VendorUpdate'));
const VendorCreate = React.lazy(() => import('./views/vendors/VendorCreate'));
const Products = React.lazy(() => import('./views/products/Products'));
const ProductsByVendor = React.lazy(() => import('./views/products/ProductsByVendor'));
const ProductCreate = React.lazy(() => import('./views/products/ProductCreate'));
const ProductUpdate = React.lazy(() => import('./views/products/ProductUpdate'));
const Chats = React.lazy(() => import('./views/chats/Chats'));
const Transactions = React.lazy(() => import('./views/transactions/Transactions'));
const TransactionsVendor = React.lazy(() => import('./views/transactions/TransactionsVendor'));
const Logout = React.lazy(()=> import('./views/pages/logout/Logout'));
const UserCreate = React.lazy(()=> import('./views/users/UserCreate'));
const Categories = React.lazy(()=> import('./views/categories/Categories'));
const Contacts = React.lazy(()=> import('./views/contacts/Contacts'));
const ContactDetail = React.lazy(()=> import('./views/contacts/ContactDetail'));

const routes = [
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/contacts', exact: true,  name: 'Users', component: Contacts },
  { path: '/contact/:id', exact: true,  name: 'Users', component: ContactDetail },
  { path: '/categories', exact: true,  name: 'Categories', component: Categories },
  { path: '/users/:id/update', exact: true, name: 'Update User', component: UserForm },
  { path: '/vendors', exact: true, name: 'Update User', component: Vendors },
  { path: '/vendor/create', exact: true, name: 'Update User', component: VendorCreate },
  { path: '/vendor/update/:id', exact: true, name: 'Update User', component: VendorUpdate },
  { path: '/my-products', exact: true, name: 'Products', component: Products },
  { path: '/my-product/create/:id', exact: true, name: 'create', component: ProductCreate },
  { path: '/user/create', exact: true, name: 'Create User', component: UserCreate },
  { path: '/my-product/update/:id', exact: true, name: 'Update User', component: ProductUpdate },
  { path: '/chats', exact: true, name: 'Update User', component: Chats },
  { path: '/transactions', exact: true, name: 'Transaction list', component: Transactions },
  { path: '/transactions/:id', exact: true, name: 'Vendor Transaction list', component: TransactionsVendor },
  { path: '/logout', exact: true, name: 'Logout', component: Logout },
  { path: '/my-product/:vendorId', exact: true, name: 'My Products', component: ProductsByVendor },
];

export default routes;
