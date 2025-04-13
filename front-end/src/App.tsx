import { 
  createBrowserRouter,
  RouterProvider,
 } from 'react-router-dom';  
import './App.css'
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ArticlesListPage from './pages/ArticlesListPage.tsx';  
import ArticlePage from './pages/ArticlePage.tsx';
import Layout from './Layout.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

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
