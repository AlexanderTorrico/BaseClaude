import React from 'react';
import { Button, Badge, UncontrolledTooltip } from 'reactstrap';
import { useCart } from '../hooks/useCart';

interface FloatingActionButtonsProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onCompareClick: () => void;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onCartClick,
  onWishlistClick,
  onCompareClick,
}) => {
  const { getTotalItems, wishlist, compare } = useCart();

  const totalCartItems = getTotalItems();
  const totalWishlistItems = wishlist.length;
  const totalCompareItems = compare.length;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1040,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {totalCompareItems > 0 && (
        <>
          <Button
            color="info"
            className="rounded-circle shadow-lg position-relative"
            style={{ width: '56px', height: '56px' }}
            onClick={onCompareClick}
            id="compare-fab"
          >
            <i className="mdi mdi-compare font-size-20"></i>
            {totalCompareItems > 0 && (
              <Badge
                color="danger"
                pill
                className="position-absolute"
                style={{
                  top: '-5px',
                  right: '-5px',
                  minWidth: '22px',
                  fontSize: '11px',
                }}
              >
                {totalCompareItems}
              </Badge>
            )}
          </Button>
          <UncontrolledTooltip placement="left" target="compare-fab">
            Comparar productos
          </UncontrolledTooltip>
        </>
      )}

      {totalWishlistItems > 0 && (
        <>
          <Button
            color="danger"
            className="rounded-circle shadow-lg position-relative"
            style={{ width: '56px', height: '56px' }}
            onClick={onWishlistClick}
            id="wishlist-fab"
          >
            <i className="mdi mdi-heart font-size-20"></i>
            {totalWishlistItems > 0 && (
              <Badge
                color="warning"
                pill
                className="position-absolute"
                style={{
                  top: '-5px',
                  right: '-5px',
                  minWidth: '22px',
                  fontSize: '11px',
                }}
              >
                {totalWishlistItems}
              </Badge>
            )}
          </Button>
          <UncontrolledTooltip placement="left" target="wishlist-fab">
            Lista de deseos
          </UncontrolledTooltip>
        </>
      )}

      <Button
        color="primary"
        className="rounded-circle shadow-lg position-relative"
        style={{ width: '64px', height: '64px' }}
        onClick={onCartClick}
        id="cart-fab"
      >
        <i className="mdi mdi-cart font-size-24"></i>
        {totalCartItems > 0 && (
          <Badge
            color="success"
            pill
            className="position-absolute"
            style={{
              top: '-8px',
              right: '-8px',
              minWidth: '24px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {totalCartItems}
          </Badge>
        )}
      </Button>
      <UncontrolledTooltip placement="left" target="cart-fab">
        Carrito de compras
      </UncontrolledTooltip>
    </div>
  );
};

export default FloatingActionButtons;
