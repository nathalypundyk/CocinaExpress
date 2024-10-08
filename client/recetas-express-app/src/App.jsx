import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/Login.page';
import RegisterForm from './components/RegisterForm/RegisterForm';
import CreatePost from './pages/CreatePostPage/CreatePost.page';
import { useState } from 'react';
import PopularRecipes from './components/Home/Home.jsx';
import ViewRecipe from './components/ViewRecipe/viewrecipe.jsx';
import PopRecipes from './components/MainHome/MainHome.jsx';
import RecipeDetails from './pages/CreatePostPage/Post.Details.jsx';
import ProfilePage from './pages/ProfilePage/Profile.page.jsx';
import UpdateProfile from './pages/UpdateProfile/UpdateProfile.page.jsx';
function App() {
    const [userData, setUserData] = useState(null);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PopRecipes />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterForm setUserData={setUserData} />} />
                <Route path="/create-post" element={<CreatePost userData={userData} />} />
                <Route path="/home" element={<PopularRecipes />} />
                <Route path='/recipe/:id' element={<ViewRecipe />} />
                <Route path='/recetas/:id' element={<RecipeDetails />} />
                <Route path="/profile" element={<ProfilePage userData={userData} editable={true}/>}/>
                <Route path="/profile/:userId" element={<ProfilePage editable={false}/>}/>
                <Route path="/update/:userId" element={<UpdateProfile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
