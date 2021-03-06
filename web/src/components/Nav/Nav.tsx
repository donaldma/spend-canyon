import './Nav.scss'
import React from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
// @ts-ignore
import classNames from 'classnames'
import { AuthService } from '../../services/AuthService'
import { ErrorService } from '../../services/ErrorService'

interface IProps {
  isAuthenticated: boolean
  setAuthenticationStatus: (isAuthenticated: boolean) => void
}

interface IState {
  mobileNavOpen: boolean
}

class Nav extends React.Component<IProps & RouteComponentProps, IState> {
  state = {
    mobileNavOpen: false
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick)
  }

  componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ mobileNavOpen: false })
    }
  }

  handleNavTriggerClick = () => {
    this.setState({ mobileNavOpen: !this.state.mobileNavOpen })
  }

  wrapperRef = React.createRef<HTMLElement>()

  handleClick = (event: any) => {
    const node = this.wrapperRef.current
    if (node && !node.contains(event.target)) {
      this.setState({ mobileNavOpen: false })
    }
  }

  handleLogout = async () => {
    const { setAuthenticationStatus } = this.props
    try {
      await AuthService.logout()
      setAuthenticationStatus(false)
    } catch (err) {
      ErrorService.parseServerError(err)
    }
  }

  renderDesktopContent = () => {
    return (
      <ul className='right'>
        <li>
          <Link to='/records/new'>New Record</Link>
        </li>
        <li>
          <Link to='/records'>All Records</Link>
        </li>
        <li>
          <Link to='/iou'>IOU</Link>
        </li>
      </ul>
    )
  }

  renderMobileContent = () => {
    return (
      <ul>
        <li>
          <Link to='/records/new' className='mobile-label'>
            New Record
          </Link>
        </li>
        <li>
          <Link to='/records' className='mobile-label'>
            All Records
          </Link>
        </li>
        <li>
          <Link to='/iou' className='mobile-label'>
            IOU
          </Link>
        </li>
      </ul>
    )
  }

  render() {
    return (
      <header
        ref={this.wrapperRef}
        className={classNames('nav-header', { 'nav-open': this.state.mobileNavOpen })}
      >
        <div className='mobile-logo'>
          <Link to='/'>
            <img src='/img/nav-logo.png' alt='nav-logo' className='logo-img' />
          </Link>
        </div>
        <button className='nav-trigger button-link' onClick={() => this.handleNavTriggerClick()}>
          Open Nav
          <span aria-hidden='true' />
        </button>

        <div className='container p-0'>
          <nav className='main-nav'>
            <ul className='left'>
              <li className='logo'>
                <Link to='/'>
                  <img src='/img/nav-logo.png' alt='nav-logo' className='logo-img' />
                </Link>
              </li>
            </ul>
            {this.renderDesktopContent()}
          </nav>
        </div>

        <div className='dropdown-wrapper pb-0'>
          <div className='dropdown-list'>{this.renderMobileContent()}</div>
        </div>
      </header>
    )
  }
}

export default withRouter(Nav)
