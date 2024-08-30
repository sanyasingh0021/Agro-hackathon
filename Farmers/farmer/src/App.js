import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/Users';
import NewProduct from './products/pages/NewProduct';
import UserProducts from './products/pages/UserProducts';
import UpdateProduct from './products/pages/UpdateProduct';
import Auth from './user/pages/Auth';
import Footer from './shared/components/Navigation/Footer';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/products" exact>
          <UserProducts />
        </Route>
        <Route path="/products/new" exact>
          <NewProduct />
        </Route>
        <Route path="/products/:productId">
          <UpdateProduct />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/products" exact>
          <UserProducts />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  useEffect(() => {
    // Load the Dialogflow Messenger stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css';
    document.head.appendChild(link);

    // Load the Dialogflow Messenger script
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up by removing the stylesheet and script when the component is unmounted
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
        <Footer />
        <df-messenger
          project-id="agribot-432510"
          agent-id="c4eeba6d-2a7f-4762-8fab-d6a55e203f8e"
          language-code="en"
          max-query-length="-1"
        >
          <df-messenger-chat-bubble
            chat-title="AgriSeva">
          </df-messenger-chat-bubble>
        </df-messenger>
        <style>
          {`
            df-messenger {
              z-index: 999;
              position: fixed;
              --df-messenger-font-color: #000;
              --df-messenger-font-family: Google Sans;
              --df-messenger-chat-background: #f3f6fc;
              --df-messenger-message-user-background: #d3e3fd;
              --df-messenger-message-bot-background: #fff;
              bottom: 16px;
              right: 16px;
            }
          `}
        </style>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
