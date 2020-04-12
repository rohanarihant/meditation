import React from 'react';
import PropTypes from 'prop-types';

const AccountContext = React.createContext([]);

export class AccountProvider extends React.Component {
  constructor(props) {
    super(props);
    this.name = 'cart';
    this.remoteCart = [];
    this.defaultState = {
      cartId: null
    };
    this.state = this.defaultState;

    this.retries = 0;

    this.actions = {
      addItem: async (product, quantity) => {
        // Reset errors
        this.setState({ error: false });
        this.pushPendingUpdate(product, quantity);
      }
    };
  }




  render() {
    const context = {
      ...this.state,
      ...this.actions,
    };

    const { children } = this.props;

    return (
      <AccountContext.Provider value={{ [this.name]: context }}>
        {children}
      </AccountContext.Provider>
    );
  }
}

export const withAccount = Component => props => (
  <AccountContext.Consumer>
    { context => <Component {...context} {...props} /> }
  </AccountContext.Consumer>
);

AccountProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AccountContext;
