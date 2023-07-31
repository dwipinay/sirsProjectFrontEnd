import { BrowserRouter, Route, Routes } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./components/Login/Login"
import NavigationBar from "./components/NavigationBar/NavigationBar"

// User
import FormUbahPassword from "./components/User/FormUbahPassword"
import FormTambahUser from "./components/User/FormTambahUser"

// RL 1.2
import RL12 from "./components/RL12/RL12.js"
import FormEditRL12 from "./components/RL12/FormEditRL12"
import FormTambahRL12 from "./components/RL12/FormTambahRL12"

// RL 1.3
import RL13 from "./components/RL13/RL13.js"
import FormTambahRL13 from "./components/RL13/FormTambahRL13"
import FormUbahRL13 from "./components/RL13/FormUbahRL13"

// RL 3.1
import RL31 from "./components/RL31/RL31.js"
import FormTambahRL31 from "./components/RL31/FormTambahRL31"
import FormUbahRL31 from "./components/RL31/FormUbahRL31"

// RL 3.2
import RL32 from "./components/RL32/RL32.js"
import FormTambahRL32 from "./components/RL32/FormTambahRL32"
import FormUbahRL32 from "./components/RL32/FormUbahRL32"

// RL 3.3
import RL33 from "./components/RL33/RL33.js"
import FormTambahRL33 from "./components/RL33/FormTambahRL33"
import FormUbahRL33 from "./components/RL33/FormUbahRL33"

// RL 3.4
import FormTambahRL34 from "./components/RL34/FormTambahRL34"
import FormUbahRL34 from "./components/RL34/FormUbahRL34"
import RL34 from "./components/RL34/RL34.js"

// RL 3.5
import FormTambahRL35 from "./components/RL35/FormTambahRL35"
import FormUbahRL35 from "./components/RL35/FormUbahRL35"
import RL35 from "./components/RL35/RL35.js"

// RL 3.6
import RL36 from "./components/RL36/RL36.js";
import FormTambahRL36 from "./components/RL36/FormTambahRL36";
import { FormEditRL36 } from "./components/RL36/FormEditRL36"

// RL 3.7
import RL37 from "./components/RL37/RL37"
import FormTambahRL37 from "./components/RL37/FormTambahRL37"
import FormUbahRL37 from "./components/RL37/FormUbahRL37"

// RL 3.8
import RL38 from "./components/RL38/RL38"
import FormTambahRL38 from "./components/RL38/FormTambahRL38"
import { FormEditRL38 } from "./components/RL38/FormUbahRL38"

// RL 3.9
import RL39 from "./components/RL39/RL39.js";
import FormTambahRL39 from "./components/RL39/FormTambahRL39";
import { FormEditRL39 } from "./components/RL39/FormEditRL39"

// RL 3.10
import RL310 from "./components/RL310/RL310.js"
import FormEditRL310 from "./components/RL310/FormEditRL310"
import FormTambahRL310 from "./components/RL310/FormTambahRL310"

// RL 3.11
import RL311 from "./components/RL311/RL311.js"
import FormEditRL311 from "./components/RL311/FormEditRL311"
import FormTambahRL311 from "./components/RL311/FormTambahRL311"

// RL 3.12
import RL312 from "./components/RL312/RL312"
import FormTambahRL312 from "./components/RL312/FormTambahRL312"
import FormUbahRL312 from "./components/RL312/FormUbahRL312"

// RL 3.13A
import RL313A from "./components/RL313A/RL313A"
import FormTambahRL313A from "./components/RL313A/FormTambahRL313A"
import FormUbahRL313A from "./components/RL313A/FormUbahRL313A"

// RL 3.13B
import RL313B from "./components/RL313B/RL313B"
import FormTambahRL313B from "./components/RL313B/FormTambahRL313B"
import FormUbahRL313B from "./components/RL313B/FormUbahRL313B"

// RL 3.14
import RL314 from "./components/RL314/RL314.js"
import FormTambahRL314 from "./components/RL314/FormTambahRL314"
import FormUbahRL314 from "./components/RL314/FormUbahRL314"

// RL 3.15
import RL315 from "./components/RL315/RL315.js"
import FormTambahRL315 from "./components/RL315/FormTambahRL315"
import FormUbahRL315 from "./components/RL315/FormUbahRL315"

// RL 4a
import RL4A from "./components/RL4A/RL4A"
import FormTambahRL4a from "./components/RL4A/FormTambahRL4A"
import { FormUbahRL4A } from "./components/RL4A/FormUbahRL4A"

// RL 4a sebab
import RL4ASebab from "./components/RL4ASebab/RL4ASebab"
import FormTambahRL4ASebab from "./components/RL4ASebab/FormTambahRL4ASebab"
import { FormUbahRL4ASebab } from "./components/RL4ASebab/FormUbahRL4ASebab"

// RL 4b
import RL4B from "./components/RL4B/RL4B.js"
import FormTambahRL4B from "./components/RL4B/FormTambahRL4B";
import { FormEditRL4B } from "./components/RL4B/FormEditRL4B"

// RL 4b sebab
import RL4BSebab from "./components/RL4BSebab/RL4BSebab"
import FormTambahRL4BSebab from "./components/RL4BSebab/FormTambahRL4BSebab"
import { FormEditRL4BSebab } from "./components/RL4BSebab/FormEditRL4BSebab"

//RL 5.1
import FormTambahRL51 from "./components/RL51/FormTambahRL51"
import FormUbahRL51 from "./components/RL51/FormUbahRL51"
import RL51 from "./components/RL51/RL51.js"

//RL 5.2
import FormTambahRL52 from "./components/RL52/FormTambahRL52"
import FormUbahRL52 from "./components/RL52/FormUbahRL52"
import RL52 from "./components/RL52/RL52.js"

// RL 5.3
import RL53 from "./components/RL53/RL53.js";
import FormUbahRL53  from "./components/RL53/FormUbahRL53";
import FormTambahRL53 from "./components/RL53/FormTambahRL53";

//RL 5.4
import FormTambahRL54 from "./components/RL54/FormTambahRL54"
import FormUbahRL54 from "./components/RL54/FormUbahRL54"
import RL54 from "./components/RL54/RL54.js"

function App() {
  return (
    <BrowserRouter basename="/sirs">
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/beranda" element={<><NavigationBar/></>} />
        <Route path="/user/tambahuser" element={<><NavigationBar/><FormTambahUser/></>}/>
        <Route path="/user/ubahpassword" element={<><NavigationBar/><FormUbahPassword/></>}/>

        <Route path="/rl12" element={<><NavigationBar/><RL12/></>}/>
        <Route path="/rl12/tambah" element={<><NavigationBar/><FormTambahRL12/></>}/>
        <Route path="/rl12/edit/:id" element={<><NavigationBar/><FormEditRL12/></>}/>

        <Route path="/rl13" element={<><NavigationBar/><RL13/></>}/>
        <Route path="/rl13/tambah" element={<><NavigationBar/><FormTambahRL13/></>}/>
        <Route path="/rl13/ubah/:id" element={<><NavigationBar/><FormUbahRL13/></>}/>

        <Route path="/rl31" element={<><NavigationBar/><RL31/></>}/>
        <Route path="/rl31/tambah" element={<><NavigationBar/><FormTambahRL31/></>}/>
        <Route path="/rl31/ubah/:id" element={<><NavigationBar/><FormUbahRL31/></>}/>

        <Route path="/rl32" element={<><NavigationBar/><RL32/></>}/>
        <Route path="/rl32/tambah" element={<><NavigationBar/><FormTambahRL32/></>}/>
        <Route path="/rl32/ubah/:id" element={<><NavigationBar/><FormUbahRL32/></>}/>

        <Route path="/rl33" element={<><NavigationBar/><RL33/></>}/>
        <Route path="/rl33/tambah" element={<><NavigationBar/><FormTambahRL33/></>}/>
        <Route path="/rl33/ubah/:id" element={<><NavigationBar/><FormUbahRL33/></>}/>
        
        <Route path="/rl34" element={<><NavigationBar/><RL34/></>}/>
        <Route path="/rl34/tambah" element={<><NavigationBar/><FormTambahRL34/></>}/>
        <Route path="/rl34/ubah/:id" element={<><NavigationBar/><FormUbahRL34/></>}/>
        
        <Route path="/rl35" element={<><NavigationBar/><RL35/></>}/>
        <Route path="/rl35/tambah" element={<><NavigationBar/><FormTambahRL35/></>}/>
        <Route path="/rl35/ubah/:id" element={<><NavigationBar/><FormUbahRL35/></>}/>
        
        <Route path="/rl36" element={<><NavigationBar/><RL36/></>}/>
        <Route path="/rl36/tambah" element={<><NavigationBar/><FormTambahRL36/></>}/>
        <Route path="/rl36/ubah/:id" element={<><NavigationBar/><FormEditRL36/></>}/>

        <Route path="/rl37" element={<><NavigationBar/><RL37/></>}/>
        <Route path="/rl37/tambah" element={<><NavigationBar/><FormTambahRL37/></>}/>
        <Route path="/rl37/ubah/:id" element={<><NavigationBar/><FormUbahRL37/></>}/>

        <Route path="/rl38" element={<><NavigationBar/><RL38/></>}/>
        <Route path="/rl38/tambah"element={<><NavigationBar/><FormTambahRL38/></>}/>
        <Route path="/rl38/ubah/:id" element={<><NavigationBar/><FormEditRL38 /></>}/>

        <Route path="/rl39" element={<><NavigationBar/><RL39/></>}/>
        <Route path="/rl39/tambah" element={<><NavigationBar/><FormTambahRL39/></>}/>
        <Route path="/rl39/ubah/:id" element={<><NavigationBar/><FormEditRL39/></>}/>

        <Route path="/rl310" element={<><NavigationBar/><RL310/></>}/>
        <Route path="/rl310/tambah" element={<><NavigationBar/><FormTambahRL310/></>}/>
        <Route path="/rl310/edit/:id" element={<><NavigationBar/><FormEditRL310/></>}/>

        <Route path="/rl311" element={<><NavigationBar/><RL311/></>}/>
        <Route path="/rl311/tambah" element={<><NavigationBar/><FormTambahRL311/></>}/>
        <Route path="/rl311/edit/:id" element={<><NavigationBar/><FormEditRL311/></>}/>

        <Route path="/rl312" element={<><NavigationBar/><RL312/></>}/>
        <Route path="/rl312/tambah" element={<><NavigationBar/><FormTambahRL312/></>}/>
        <Route path="/rl312/ubah/:id" element={<><NavigationBar/><FormUbahRL312/></>}/>

        <Route path="/rl313A" element={<><NavigationBar/><RL313A/></>}/>
        <Route path="/rl313A/tambah" element={<><NavigationBar/><FormTambahRL313A/></>}/>
        <Route path="/rl313A/ubah/:id" element={<><NavigationBar/><FormUbahRL313A/></>}/>

        <Route path="/rl313B" element={<><NavigationBar/><RL313B/></>}/>
        <Route path="/rl313B/tambah" element={<><NavigationBar/><FormTambahRL313B/></>}/>
        <Route path="/rl313B/ubah/:id" element={<><NavigationBar/><FormUbahRL313B/></>}/>

        <Route path="/rl314" element={<><NavigationBar/><RL314/></>}/>
        <Route path="/rl314/tambah" element={<><NavigationBar/><FormTambahRL314/></>}/>
        <Route path="/rl314/ubah/:id" element={<><NavigationBar/><FormUbahRL314/></>}/>

        <Route path="/rl315" element={<><NavigationBar/><RL315/></>}/>
        <Route path="/rl315/tambah" element={<><NavigationBar/><FormTambahRL315/></>}/>
        <Route path="/rl315/ubah/:id" element={<><NavigationBar/><FormUbahRL315/></>}/>

        <Route path="/rl4a" element={<><NavigationBar/><RL4A/></>}/>
        <Route path="/rl4a/tambah" element={<><NavigationBar/><FormTambahRL4a/></>}/>
        <Route path="/rl4a/ubah/:id" element={<><NavigationBar/><FormUbahRL4A/></>}/>

        <Route path="/rl4asebab" element={<><NavigationBar/><RL4ASebab/></>}/>
        <Route path="/rl4asebab/tambah" element={<><NavigationBar/><FormTambahRL4ASebab/></>}/>
        <Route path="/rl4asebab/ubah/:id" element={<><NavigationBar/><FormUbahRL4ASebab/></>}/>

        <Route path="/rl4b" element={<><NavigationBar/><RL4B/></>}/>
        <Route path="/rl4b/tambah" element={<><NavigationBar/><FormTambahRL4B/></>}/>
        <Route path="/rl4b/ubah/:id" element={<><NavigationBar/><FormEditRL4B/></>}/>

        <Route path="/rl4bsebab" element={<><NavigationBar/><RL4BSebab/></>}/>
        <Route path="/rl4bsebab/tambah" element={<><NavigationBar/><FormTambahRL4BSebab/></>}/>
        <Route path="/rl4bsebab/ubah/:id" element={<><NavigationBar/><FormEditRL4BSebab/></>}/>

        <Route path="/rl51" element={<><NavigationBar/><RL51/></>}/>
        <Route path="/rl51/tambah" element={<><NavigationBar/><FormTambahRL51/></>}/>
        <Route path="/rl51/ubah/:id" element={<><NavigationBar/><FormUbahRL51/></>}/>
        
        <Route path="/rl52" element={<><NavigationBar/><RL52/></>}/>
        <Route path="/rl52/tambah" element={<><NavigationBar/><FormTambahRL52/></>}/>
        <Route path="/rl52/ubah/:id" element={<><NavigationBar/><FormUbahRL52/></>}/>

        <Route path="/rl53" element={<><NavigationBar/><RL53/></>}/>
        <Route path="/rl53/tambah" element={<><NavigationBar/><FormTambahRL53/></>}/>
        <Route path="/rl53/ubah/:id" element={<><NavigationBar/><FormUbahRL53/></>}/>

        <Route path="/rl54" element={<><NavigationBar/><RL54/></>}/>
        <Route path="/rl54/tambah" element={<><NavigationBar/><FormTambahRL54/></>}/>
        <Route path="/rl54/ubah/:id" element={<><NavigationBar/><FormUbahRL54/></>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
