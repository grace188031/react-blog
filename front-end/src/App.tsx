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
import axios from 'axios';

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
    loader: async function() {
      // await axios.get('http://localhost:8000/api/articles/:name')
      const response = await axios.get('/api/articles/learn-node');
      const { upvotes, comments } = response.data;
      return { upvotes, comments };

    }
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
