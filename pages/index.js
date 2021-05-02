import Head from 'next/head';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Eye, Edit3 } from 'react-feather';
import { useRouter } from 'next/router';
import * as ProductApi from '../api/products';
import { API_STATUS } from '../api';

export const boxShadowValues = '3px 10px 29px -11px rgba(0,0,0,0.50)';

export default function Home({ setLoading }) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize]);


  async function fetchProducts() {
    try {
      setLoading(true);
      const products = await ProductApi.list(page, pageSize);
      setProducts(products.data.data);
      setTotalPages(Math.floor(products.data.total / pageSize));
    } catch (error) {
      alert('Failed to fetch products');
      // console.log('failed to fetch products')
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: '100px', }} >
      <Head>
        <title>Inventory Management App</title>
      </Head>
      <div style={{ height: '35%', maxHeight: '400px', minHeight: '200px', background: 'url(./gradient-banner.jpg)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', }} >
        <h2 style={{ color: 'white', paddingTop: '5%', textAlign: 'center', }}>Products</h2>
      </div>

      <Table style={{ width: '75%', margin: 'auto', marginTop: '-50px', background: 'white', boxShadow: boxShadowValues, WebkitBoxShadow: boxShadowValues, }}>
        <thead>
          <tr>
            <th>Core Number</th>
            <th>Internal Title</th>
            <th>Vendor</th>
            <th>Vendor Title</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(each =>
          (<tr key={each.id}>
            <td>{each.coreNumber}</td>
            <td>{each.internalTitle}</td>
            <td>{each.vendor}</td>
            <td>{each.vendorTitle}</td>
            <td>{each.vendorSKU}</td>
            <td><>
              <Eye onClick={() => { router.push(`/${each.id}`); }} />
            </></td>
          </tr>)

          )}
        </tbody>
      </Table>

      <Pagination totalPages={totalPages} currentPage={page} currentPageSize={pageSize} onChangePageSize={setPageSize} onChangePage={setPage} />
    </div>
  );
}

function Pagination({ currentPage = 0, currentPageSize = 10, totalPages = 1, onChangePageSize, onChangePage }) {
  return (
    <div style={{ background: 'white', boxShadow: boxShadowValues, padding: '20px', WebkitBoxShadow: boxShadowValues, margin: '20px auto', width: '75%', minWidth: '500px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>Page Size : <select onChange={(event) => onChangePageSize(event.target.value)}>
        <option selected={currentPageSize === 10}>10</option>
        <option selected={currentPageSize === 20}>20</option>
        <option selected={currentPageSize === 50}>50</option>
      </select></div>

      <div style={{ display: 'flex', }}>
        {currentPage < 2 ? null : <PaginationButton onClick={() => onChangePage(0)} value='<<' />}
        {currentPage === 0 ? null : <PaginationButton onClick={() => onChangePage(currentPage - 1)} value='<' />}
        <PaginationButton onClick={() => { }} value={currentPage + 1} isCurrentPage />
        {currentPage === totalPages ? null : <PaginationButton onClick={() => onChangePage(currentPage + 1)} value='>' />}
        {currentPage > totalPages - 2 ? null : <PaginationButton onClick={() => onChangePage(totalPages)} value='>>' />}
      </div>
    </div>
  );
}


function PaginationButton({ value, isCurrentPage = false, onClick }) {
  return (
    <div style={{ borderRadius: '50%', padding: '20px', height: '30px', width: '30px', background: isCurrentPage ? 'black' : 'white', color: isCurrentPage ? 'white' : 'black', margin: '0 10px', boxShadow: boxShadowValues, WebkitBoxShadow: boxShadowValues, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', }} onClick={onClick}>
      {value}
    </div>
  );
}

// export async function getServerSideProps() {
//   try {
//     const response = await ProductApi.list(0, 10);
//     return { props: { response } };
//   } catch (error) {
//     console.log('failed to fetch products -> ', error);
//     return {};
//   }
// }