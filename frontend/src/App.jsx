import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import GenerateImages from './pages/GenerateImages'
import GenerateVideos from './pages/GenerateVideos'
import PostOnInstagram from './pages/PostOnInstagram'
import PostOnX from './pages/PostOnX'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/ai' element={<Layout />}>
        <Route index element={<Dashboard />} />         {/* <-- FIXED */}
        <Route path='generate-image' element={<GenerateImages />} />
        <Route path='generate-videos' element={<GenerateVideos />} />
        <Route path='post-insta' element={<PostOnInstagram />} />
        <Route path='post-x' element={<PostOnX />} />
        <Route path='profile' element={<ProfilePage />} />
        <Route path='settings' element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
