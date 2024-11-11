import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatus = {
  in_progress: 'IN_PROGRESS',
  failed: 'FAILED',
  success: 'SUCCESS',
}

class ProductItemDetails extends Component {
  state = {
    status: apiStatus.in_progress,
    productItem: {},
    similarProductData: [],
    cartCount: 1,
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  onClicknavToProducts = () => {
    const {history} = this.props
    console.log(history)
    history.replace('/products')
  }

  onClickAddItem = () => {
    this.setState(prevState => ({
      cartCount: prevState.cartCount + 1,
    }))
  }

  onClickRemoveItem = () => {
    const {cartCount} = this.state
    if (cartCount > 1) {
      this.setState(prevState => ({
        cartCount: prevState.cartCount - 1,
      }))
    }
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const productsApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(productsApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const updatedSimilarData = data.similar_products.map(eachItem =>
        this.getFormattedData(eachItem),
      )
      this.setState({
        productItem: updatedData,
        similarProductData: updatedSimilarData,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failed})
    }
  }

  renderProductDetailsView = () => {
    const {productItem, cartCount, similarProductData} = this.state
    console.log(productItem)
    const {
      availability,
      title,
      brand,
      imageUrl,
      price,
      rating,
      description,
      id,
      totalReviews,
    } = productItem
    return (
      <>
        <div className="product-item-container">
          <div className="img-container">
            <img src={imageUrl} alt="product" className="failure-image" />
          </div>
          <div className="item-details-container">
            <h1>{title}</h1>
            <p className="price-tag">{price}/-</p>
            <div className="rating-reviews-container">
              <p className="rating-tag">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="start-icon"
              />
            </div>
            <div className="description-container">
              <p>{description}</p>
            </div>
            <div className="availability-brand-container">
              <p>{availability}</p>
              <p>{brand}</p>
            </div>
            <hr />
            <div className="quantity-btn-container">
              <button
                className="items-change-btn"
                onClick={this.onClickAddItem}
                data-testid="plus"
              >
                <BsPlusSquare className="bs-icons" />
              </button>
              <p>{cartCount}</p>
              <button
                className="items-change-btn"
                onClick={this.onClickRemoveItem}
                data-testid="minus"
              >
                <BsDashSquare className="bs-icons" />
              </button>
            </div>
            <button className="add-to-cart-btn">ADD TO CART</button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Product</h1>
          <ul className="bottom-products-container">
            {similarProductData.map(eachItem => (
              <SimilarProductItem key={eachItem.id} itemDetails={eachItem} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-inner-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-text">Product Not Found</h1>
      <button onClick={this.onClicknavToProducts}>Continue Shopping</button>
    </div>
  )

  renderProductsView = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.success:
        return this.renderProductDetailsView()
      case apiStatus.failed:
        return this.renderFailureView()
      default:
        return this.renderLoadingView()
    }
  }

  render() {
    const {status} = this.state
    let viewClassName
    switch (status) {
      case apiStatus.in_progress:
        viewClassName = 'progress-view'
        break
      case apiStatus.success:
        viewClassName = 'success-view'
        break
      case apiStatus.failed:
        viewClassName = 'failure-view'
        break
      default:
        viewClassName = null
    }
    return (
      <>
        <Header />
        <div className={viewClassName}>{this.renderProductsView()}</div>
      </>
    )
  }
}

export default ProductItemDetails
