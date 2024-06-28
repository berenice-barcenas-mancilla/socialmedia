import { Routes, Route } from 'react-router-dom';

import {
  Home
} from '@/_root/pages';

import AuthLayout from './_auth/AuthLayout';

import SinginForm from '@/_auth/forms/SinginForm';
import SingupForm from '@/_auth/forms/SingupForm';
// import { Toaster } from "@/components/ui/toaster"  // Esto es un componente Toaster que está comentado

import './globals.css';

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/sing-in" element={<SinginForm />} /> {/* Ruta para el formulario de inicio de sesión */}
          <Route path="/sing-in" element={<SingupForm />} /> {/* Ruta para el formulario de registro */}
        </Route>

        {/* Rutas privadas */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} /> {/* Ruta de inicio */}
          <Route path="/explore" element={<Explore />} /> {/* Ruta para explorar */}
          <Route path="/saved" element={<Saved />} /> {/* Ruta para los elementos guardados */}
          <Route path="/all-users" element={<AllUsers />} /> {/* Ruta para todos los usuarios */}
          <Route path="/create-post" element={<CreatePost />} /> {/* Ruta para crear una publicación */}
          <Route path="/update-post/:id" element={<EditPost />} /> {/* Ruta para actualizar una publicación */}
          <Route path="/posts/:id" element={<PostDetails />} /> {/* Ruta para ver detalles de una publicación */}
          <Route path="/profile/:id/*" element={<Profile />} /> {/* Ruta para ver el perfil de un usuario */}
          <Route path="/update-profile/:id" element={<UpdateProfile />} /> {/* Ruta para actualizar el perfil de un usuario */}
        </Route>
      </Routes>
      {/* <Toaster/> */} {/* Componente Toaster comentado */}
    </main>
  )
}

export default App;
