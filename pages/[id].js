import { Card, Form, Container, Row, Col } from 'react-bootstrap';
import { boxShadowValues } from '.';
import { useRouter } from 'next/router';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import ProductApi from '../api/products';
import ProductLocationApi from '../api/productLocations';

function Product(props) {
  const { setLoading, loading } = props;
  const router = useRouter();
  const [product, setProduct] = useState({});

  async function fetchProduct() {
    try {
      const { id } = router.query;
      setLoading(true);
      const response = await ProductApi.get(id);
      // console.log('updated products -> ', response);
      setProduct(response.data);
    } catch (error) {
      alert('Unable to get product details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProduct(); }, []);

  const currentTotal = product.locations.reduce((total, each) => {
    if (!each) return total;
    // because some of the values can be strings, unfortunately.
    return parseInt(total) + parseInt(each.quantity.toString().split(',').join(''));
  }, 0);

  return <div style={{ marginBottom: '100px', }}>

    <div style={{ height: '35%', maxHeight: '400px', minHeight: '200px', background: 'url(./gradient-banner.jpg)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', paddingBottom: '20px', }} >
      <h2 style={{ color: 'white', paddingTop: '5%', textAlign: 'center', width: '75%', minWidth: '500px', margin: 'auto', }}>

        <img src='./back-arrow-white.svg' style={{ marginRight: '30px', cursor: 'pointer', }} onClick={() => router.push('/')} />
        {product.internalTitle}
      </h2>
    </div>

    <Card style={{ width: '75%', maxWidth: '1000px', minWidth: '500px', margin: 'auto', marginTop: '-50px', boxShadow: boxShadowValues, WebkitBoxShadow: boxShadowValues }}>

      <Card.Body>
        <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', }}>
          {/* <Section title='ID' value={response?.id} /> */}
          <Section title='Total Quantity' value={currentTotal} />
          <Section title='Core Number' value={product?.coreNumber} />
          <Section title='Active' value={product?.active} />

          <Section title='Backup Vendor' value={product?.backupVendor} />
          <Section title='Backup Vendor SKU' value={product?.backupVendorSKU} />
          <Section title='Boxes Per Case' value={product?.boxesPerCase} />
          <Section title='Buffer Days' value={product?.bufferDays} />
          <Section title='Case Pack' value={product?.casePack} />
          <Section title='Hazmat' value={product?.hazmat} />
          <Section title='Ignore Until' value={product?.ignoreUntil} />
          <Section title='Internal Title' value={product?.internalTitle} />
          <Section title='Minimum Level' value={product?.minLevel} />
          <Section title='MOQ' value={product?.moq} />
          <Section title='Note for Next Order' value={product?.noteForNextOrder} />
          <Section title='Pieces per Internal Box' value={product?.piecesPerInternalBox} />
          <Section title='Product URL' value={product?.productUrl} />
          <Section title='Restockable' value={product?.restockable} />
          <Section title='Tag 1' value={product?.tag1} />
          <Section title='Tag 2' value={product?.tag2} />
          <Section title='Tag 3' value={product?.tag3} />
          <Section title='Tag 4' value={product?.tag4} />
          <Section title='Tags & Info' value={product?.tagsAndInfo} />
          <Section title='Vendor' value={product?.vendor} />
          <Section title='Vendor Case Pack' value={product?.vendorCasePack} />
          <Section title='Vendor Order Unit' value={product?.vendorOrderUnit} />
          <Section title='Vendor SKU' value={product?.vendorSKU} />
          <Section title='Vendor Title' value={product?.vendorTitle} />
          <Section title='' value={''} />
        </div >

        <br /><br /><hr />

        <h2>Locations</h2>
        {product?.locations?.length === 0 ? "No locations to display" : <Locations loading={loading} setLoading={setLoading} locations={product.locations} refreshProduct={fetchProduct} />}

        <br /><br /><hr />

        <Section title='Notes' value={product?.notes} />
      </Card.Body>
    </Card>
    <style jsx>{`
   
    `}</style>
  </div>;
}

const Locations = ({ locations, setLoading, refreshProduct }) => {
  const QUANTITIY_UPDATE_TYPES = {
    ADD: 'Add', SUBTRACT: 'Subtract'
  };
  const [locationToUpdate, setLocationToUpdate] = useState();
  const [updateOperation, setUpdateOperation] = useState(QUANTITIY_UPDATE_TYPES.ADD);
  const [updateQuantity, setUpdateQuantity] = useState('');


  async function storeQuantityUpdate() {
    try {
      // setLoading(true);
      const newQuantity = updateOperation === QUANTITIY_UPDATE_TYPES.ADD
        ? parseInt(locationToUpdate.quantity) + parseInt(updateQuantity)
        : parseInt(locationToUpdate.quantity) - parseInt(updateQuantity);

      await ProductLocationApi.update({ quantity: newQuantity, id: locationToUpdate.id });
      await refreshProduct();
      setUpdateQuantity('');
      setLocationToUpdate();
      alert('Quantity updated');
    } catch (error) {
      alert('Unable to update quantity');
      // console.log('error -> ', error);
    } finally {
      setLoading(false);
    }
  }

  return <div style={{}}>
    <QuantityModal operation={updateOperation} location={(locationToUpdate)}
      onClose={() => { setLocationToUpdate(); setUpdateQuantity(''); }}
      onChange={e => setUpdateQuantity(e.target.value)}
      quantity={updateQuantity}
      onSave={storeQuantityUpdate}
    />

    {locations.map((each, index) => <div key={each.id} style={{ display: 'flex', alignItems: 'center', }}>
      <span>{index + 1}</span>
      <Section title='Location' value={each.Location.name} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', }}>

        <button onClick={() => {
          setUpdateOperation(QUANTITIY_UPDATE_TYPES.SUBTRACT);
          setLocationToUpdate(each);
        }}>-</button>

        <Section title='Quantity' value={each.quantity} />

        <button onClick={() => {
          setUpdateOperation(QUANTITIY_UPDATE_TYPES.ADD);
          setLocationToUpdate(each);
        }}>+</button>
      </div>
    </div>)}
  </div>;
};

const QuantityModal = ({ operation, location, onClose, onChange, quantity, onSave }) => {
  if (!location) return null;

  return <Modal show={Boolean(location)} centered onHide={onClose}>
    <Modal.Header closeButton >
      <Modal.Title>{operation} Quantity {operation === 'Add' ? 'to' : 'from'} Location {location.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h5>Quantity to {operation}</h5>
      <input autoFocus type='number' value={quantity} placeholder={location.quantity} onChange={onChange} />
    </Modal.Body>
    <Modal.Footer>
      <button onClick={onSave}>Save</button>
    </Modal.Footer>
  </Modal>;
};

const Section = ({ children, title, value }) => <div style={{ width: '20%', minWidth: '200px', margin: '10px', }}>
  <h4><span style={{ fontWeight: '300', fontSize: '20px', }}>{title}:</span> <br />{value}
  </h4>
  {children}
</div>;


// export async function getServerSideProps(ctx) {
//   try {
//     const { id } = ctx.query;
//     const response = await fetch(`http://localhost/products/${id}`).then(res => res.json());
//     console.log('response -> ', response);
//     return { props: { response } };
//   } catch (error) {
//     console.log('failed to fetch product details -> ', error);
//     return { props: {} };
//   }
// }

export default Product;