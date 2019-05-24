/**
 * 定义应用路由
 */
import { HashRouter,BrowserRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import UserLayout from './layouts/UserLayout';
import BasicLayout from './layouts/BasicLayout';

// 按照 Layout 分组路由
// UserLayout 对应的路由：/user/xxx
// BasicLayout 对应的路由：/xxx
const router = () => {
  // console.log('router.jsx');
  return (
    // <HashRouter>
    //   <Switch>
    //     <Route path="/user" component={UserLayout} />
    //     <Route path="/" component={BasicLayout} />
    //   </Switch>
    // </HashRouter>
    <BrowserRouter>
       <Switch>
         <Route path="/user" component={UserLayout} />
         <Route path="/" component={BasicLayout} />
       </Switch>
    </BrowserRouter>
  );
};

export default router();
