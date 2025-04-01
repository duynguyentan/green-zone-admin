import { BrowserRouter as Router, Routes, Route } from 'react-router';
import SignIn from './pages/AuthPages/SignIn';
import NotFound from './pages/OtherPage/NotFound';
import AppLayout from './layout/AppLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import Home from './pages/Dashboard/Home';
import Category from './pages/category/CategoryPage';
import { PrivateRoute, RedirectRoute } from './components/route';
import Product from './pages/product/ProductPage';
import Order from './pages/order/OrderPage';
import Store from './pages/store/StorePage';
import Employee from './pages/employee/EmpoyeePage';
import Customer from './pages/customer/CustomerPage';
import Topping from './pages/topping/ToppingPage';
import Voucher from './pages/voucher/VoucherPage';

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route element={<PrivateRoute />}>
              <Route index path="/" element={<Home />} />
            </Route>
            <Route index path="/category" element={<Category />} />
            <Route index path="/product" element={<Product />} />
            <Route index path="/order" element={<Order />} />
            <Route index path="/store" element={<Store />} />
            <Route index path="/topping" element={<Topping />} />
            <Route index path="/voucher" element={<Voucher />} />

            {/* Others Page */}
            <Route path="/employee" element={<Employee />} />
            <Route path="/customer" element={<Customer />} />

            {/* Forms */}
            {/* <Route path="/form-elements" element={<FormElements />} /> */}

            {/* Ui Elements */}
            {/* <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} /> */}

            {/* Charts */}
            {/* <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>

          {/* Auth Layout */}
          <Route element={<RedirectRoute />}>
            <Route path="/signin" element={<SignIn />} />
          </Route>
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
