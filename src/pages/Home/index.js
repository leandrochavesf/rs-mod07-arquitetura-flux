import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

/**
 * TIPS: Quando usado os hooks com redux, nao eh necessario usar o procedimento
 * com Connect, mapStateToProps e mapDispatchToProps. Basta usar o useSelector e o acesso
 * aos dados dentro da propria arrow function
 */
export default function Home() {
  const [products, setProducts] = useState([]);
  const amount = useSelector(state =>
    state.cart.reduce((sumAmount, product) => {
      sumAmount[product.id] = product.amount;

      return sumAmount;
    }, {})
  );

  const dispatch = useDispatch();

  /**
   * TIPS: nao eh possivel usar o async direto na funcao do useEffect, logo deve-se
   * criar uma outra funcao dentro da array function para poder usar o async/await.
   * Exemplo abaixo.
   */
  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');

      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
    }

    loadProducts();
  }, []); // Nao esquecer de passar um array vazio no segundo argumento para executar o hook uma unica vez.

  function handleAddProduct(id) {
    dispatch(CartActions.addToCartRequest(id));
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>

          <button type="button" onClick={() => handleAddProduct(product.id)}>
            <div>
              <MdShoppingCart size={16} color="#FFF" />{' '}
              {amount[product.id] || 0}
            </div>

            <span>ADICONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}
