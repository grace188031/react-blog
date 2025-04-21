import { 
  createBrowserRouter,
  RouterProvider,
 } from 'react-router-dom';  
import './App.css'
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ArticlesListPage from './pages/ArticlesListPage.tsx';  
import ArticlePage, { loader as articleLoader } from './pages/ArticlePage.tsx';
import Layout from './Layout.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import CreateAccountPage from './pages/CreateAccountPage.tsx';

const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: < NotFoundPage />,
  children: [{
    path:'/',
    element:<HomePage />,
  }, {
    path:'/about',
    element:< AboutPage />,
  }, {
    path: '/articleslist',
    element: <ArticlesListPage />,
  }, {
    path: '/articles/:name',
    element: <ArticlePage />,
    // add the articleLoader function to the route
    loader: articleLoader
  }, {
    path: '/login',
    element: <LoginPage />
}, {
    path: '/create-account',
    element: <CreateAccountPage />
}]
}]

const router = createBrowserRouter(routes);

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}


export default App
