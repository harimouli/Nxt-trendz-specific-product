import './index.css'

const SimilarProductItem = props => {
  const {itemDetails} = props
  const {
    availability,
    brand,
    description,
    id,
    imageUrl,
    price,
    rating,
    style,
    title,
    totalReviews,
  } = itemDetails
  return (
    <li className="product-card">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-img"
      />
      <h1 className="similar-product-heading">{title}</h1>
      <p>by {brand}</p>
      <div className="similar-product-item-rating-price-container">
        <p>Rs {price}</p>
        <div className="rating-reviews-container">
          <p className="rating-tag">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="start-icon"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
